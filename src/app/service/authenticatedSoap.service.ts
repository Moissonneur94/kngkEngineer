// declare const Buffer;
import * as CONSTANTS from './constants';
import {Injectable} from '@angular/core';
import {Http, XHRBackend, RequestOptions, RequestMethod, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import * as xml2js from 'xml2js';
import * as processors from 'xml2js/lib/processors';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


class NTLMMsg {

  private data: any = null;

  constructor (data?: string) {
    this.data = [];
    if (undefined === data) return;
    if (data.indexOf('NTLM ') == 0) data = data.substr(5);
    atob(data).split('').map(function(c) { this.push(c.charCodeAt(0)); }, this.data);
  }

  addByte(b: number): void {
    this.data.push(b);
  }

  addShort(s: any): void {
    this.data.push(s & 0xFF);
    this.data.push((s >> 8) & 0xFF);
  }

  addString(str: string, utf16?: any): void {
    if (utf16) // Fake UTF16 by padding each character in string.
        str = str.split('').map(function(c) { return (c + '\0'); }).join('');

    for (let i = 0; i < str.length; i++)
        this.data.push(str.charCodeAt(i));
  }

  getString(offset: number, length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        if (offset + i >= this.data.length)
            return '';
        result += String.fromCharCode(this.data[offset + i]);
    }
    return result;
  }

  getByte(offset: number): number {
    return this.data[offset];
  }

  toBase64(): string {
    let str = String.fromCharCode.apply(null, this.data);
    return btoa(str).replace(/.{76}(?=.)/g,'$&');
  }

}

class NTLM {

  private domain: string = null;
  private username: string = null;
  private lmHashedPassword: string = null;
  private ntHashedPassword: string = null;

  error(msg): void {
    console.error(msg);
  }

  message(msg): void {
    console.log(msg);
  }

  createMessage1(hostname: string): NTLMMsg {
    let msg1 = new NTLMMsg();
    msg1.addString('NTLMSSP\0');
    msg1.addByte(1);
    msg1.addString('\0\0\0');
    msg1.addShort(0xb203);
    msg1.addString('\0\0');
    msg1.addShort(this.domain.length);
    msg1.addShort(this.domain.length);
    msg1.addShort(32 + hostname.length);
    msg1.addString('\0\0');
    msg1.addShort(hostname.length);
    msg1.addShort(hostname.length);
    msg1.addShort(32);
    msg1.addString('\0\0');
    msg1.addString(hostname.toUpperCase());
    msg1.addString(this.domain.toUpperCase());
    return msg1;
  }

  getChallenge(data): string {
    let msg2 = new NTLMMsg(data);
    if (msg2.getString(0, 8) != 'NTLMSSP\0') {
        this.error('Invalid NTLM response header.');
        return '';
    }
    if (msg2.getByte(8) != 2) {
        this.error('Invalid NTLM response type.');
        return '';
    }
    let challenge = msg2.getString(24, 8);
    return challenge;
  }

  createMessage3(challenge: string, hostname: string): NTLMMsg {
    let lmResponse = this.buildResponse(this.lmHashedPassword, challenge);
    let ntResponse = this.buildResponse(this.ntHashedPassword, challenge);
    let username = this.username;
    let domain = this.domain;
    let msg3 = new NTLMMsg();

    msg3.addString('NTLMSSP\0');
    msg3.addByte(3);
    msg3.addString('\0\0\0');

    msg3.addShort(24); // lmResponse
    msg3.addShort(24);
    msg3.addShort(64 + (domain.length + username.length + hostname.length) * 2);
    msg3.addString('\0\0');

    msg3.addShort(24); // ntResponse
    msg3.addShort(24);
    msg3.addShort(88 + (domain.length + username.length + hostname.length) * 2);
    msg3.addString('\0\0');

    msg3.addShort(domain.length * 2); // Domain.
    msg3.addShort(domain.length * 2);
    msg3.addShort(64);
    msg3.addString('\0\0');

    msg3.addShort(username.length * 2); // Username.
    msg3.addShort(username.length * 2);
    msg3.addShort(64 + domain.length * 2);
    msg3.addShort('\0\0');

    msg3.addShort(hostname.length * 2); // Hostname.
    msg3.addShort(hostname.length * 2);
    msg3.addShort(64 + (domain.length + username.length) * 2);
    msg3.addString('\0\0');

    msg3.addString('\0\0\0\0');
    msg3.addShort(112 + (domain.length + username.length + hostname.length) * 2);
    msg3.addString('\0\0');
    msg3.addShort(0x8201);
    msg3.addString('\0\0');

    msg3.addString(domain.toUpperCase(), true); // "Some" string are passed as UTF-16.
    msg3.addString(username, true);
    msg3.addString(hostname.toUpperCase(), true);
    msg3.addString(lmResponse);
    msg3.addString(ntResponse);

    return msg3;
  }

  createKey(str: string): string {
    let key56 = [];
    while (str.length < 7) str += '\0';
    str = str.substr(0, 7);
    str.split('').map(function(c) { this.push(c.charCodeAt(0)); }, key56);
    let key = [0, 0, 0, 0, 0, 0, 0, 0];
    key[0] = key56[0]; // Convert 56 bit key to 64 bit.
    key[1] = ((key56[0] << 7) & 0xFF) | (key56[1] >> 1);
    key[2] = ((key56[1] << 6) & 0xFF) | (key56[2] >> 2);
    key[3] = ((key56[2] << 5) & 0xFF) | (key56[3] >> 3);
    key[4] = ((key56[3] << 4) & 0xFF) | (key56[4] >> 4);
    key[5] = ((key56[4] << 3) & 0xFF) | (key56[5] >> 5);
    key[6] = ((key56[5] << 2) & 0xFF) | (key56[6] >> 6);
    key[7] =  (key56[6] << 1) & 0xFF;
    for (let i = 0; i < key.length; i++) { // Fix DES key parity bits.
        let bit = 0
        for (let k = 0; k < 7; k++) {
            let t = key[i] >> k;
            bit = (t ^ bit) & 0x1;
        }
        key[i] = (key[i] & 0xFE) | bit;
    }

    let result = '';
    key.map(function(i) { result += String.fromCharCode(i); });
    return result;
  }

  buildResponse(key: string, text: string) {
    while (key.length < 21)
        key += '\0';
    var key1 = this.createKey(key.substr(0, 7));
    var key2 = this.createKey(key.substr(7, 7));
    var key3 = this.createKey(key.substr(14, 7));
    return this.des(key1, text, 1, 0) + this.des(key2, text, 1, 0) + this.des(key3, text, 1, 0);
  }

  setCredentials(domain: string, username: string, password: string): void {
    let magic = 'KGS!@#$%'; // Create LM password hash.
    let lmPassword = password.toUpperCase().substr(0, 14);
    while (lmPassword.length < 14) lmPassword += '\0';
    let key1 = this.createKey(lmPassword);
    let key2 = this.createKey(lmPassword.substr(7));
    let lmHashedPassword = this.des(key1, magic, 1, 0) + this.des(key2, magic, 1, 0);

    let ntPassword = ''; // Create NT password hash.
    for (let i = 0; i < password.length; i++)
        ntPassword += password.charAt(i) + '\0';
    let ntHashedPassword = this.str_md4(ntPassword);

    this.domain = domain;
    this.username = username;
    this.lmHashedPassword = lmHashedPassword;
    this.ntHashedPassword = ntHashedPassword;
  }

  isChallenge(xhr) {
    if (!xhr)
        return false;
    if (xhr.status != 401)
        return false;
    let header = xhr.getResponseHeader('WWW-Authenticate');
    return header && header.indexOf('NTLM') != -1;
  }

  authenticate(url) {
    if (!this.domain || !this.username || !this.lmHashedPassword || !this.ntHashedPassword) {
        this.error('No NTLM credentials specified. Use Ntlm.setCredentials(...) before making calls.');
        return false;
    }
    let hostname = new URL(url).hostname;
    let msg1 = this.createMessage1(hostname);
    let request = new XMLHttpRequest();
    request.open('GET', url, false);
    request.setRequestHeader('Authorization', 'NTLM ' + msg1.toBase64());
    request.send(null);
    let response = request.getResponseHeader('WWW-Authenticate');
    let challenge = this.getChallenge(response);

    let msg3 = this.createMessage3(challenge, hostname);
    request.open('GET', url, false);
    request.setRequestHeader('Authorization', 'NTLM ' + msg3.toBase64());
    request.send(null);
    return request.status == 200;
  }

  /*
   * A JavaScript implementation of the RSA Data Security, Inc. MD4 Message
   * Digest Algorithm, as defined in RFC 1320.
   * Version 2.1 Copyright (C) Jerrad Pierce, Paul Johnston 1999 - 2002.
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */

  private chrsz: number = 8;

  str_md4(s){ return this.binl2str(this.core_md4(this.str2binl(s), s.length * this.chrsz));}

  core_md4(x, len) {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    let a =  1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d =  271733878;

    for(let i = 0; i < x.length; i += 16) {
        let olda = a;
        let oldb = b;
        let oldc = c;
        let oldd = d;

        a = this.md4_ff(a, b, c, d, x[i+ 0], 3 );
        d = this.md4_ff(d, a, b, c, x[i+ 1], 7 );
        c = this.md4_ff(c, d, a, b, x[i+ 2], 11);
        b = this.md4_ff(b, c, d, a, x[i+ 3], 19);
        a = this.md4_ff(a, b, c, d, x[i+ 4], 3 );
        d = this.md4_ff(d, a, b, c, x[i+ 5], 7 );
        c = this.md4_ff(c, d, a, b, x[i+ 6], 11);
        b = this.md4_ff(b, c, d, a, x[i+ 7], 19);
        a = this.md4_ff(a, b, c, d, x[i+ 8], 3 );
        d = this.md4_ff(d, a, b, c, x[i+ 9], 7 );
        c = this.md4_ff(c, d, a, b, x[i+10], 11);
        b = this.md4_ff(b, c, d, a, x[i+11], 19);
        a = this.md4_ff(a, b, c, d, x[i+12], 3 );
        d = this.md4_ff(d, a, b, c, x[i+13], 7 );
        c = this.md4_ff(c, d, a, b, x[i+14], 11);
        b = this.md4_ff(b, c, d, a, x[i+15], 19);

        a = this.md4_gg(a, b, c, d, x[i+ 0], 3 );
        d = this.md4_gg(d, a, b, c, x[i+ 4], 5 );
        c = this.md4_gg(c, d, a, b, x[i+ 8], 9 );
        b = this.md4_gg(b, c, d, a, x[i+12], 13);
        a = this.md4_gg(a, b, c, d, x[i+ 1], 3 );
        d = this.md4_gg(d, a, b, c, x[i+ 5], 5 );
        c = this.md4_gg(c, d, a, b, x[i+ 9], 9 );
        b = this.md4_gg(b, c, d, a, x[i+13], 13);
        a = this.md4_gg(a, b, c, d, x[i+ 2], 3 );
        d = this.md4_gg(d, a, b, c, x[i+ 6], 5 );
        c = this.md4_gg(c, d, a, b, x[i+10], 9 );
        b = this.md4_gg(b, c, d, a, x[i+14], 13);
        a = this.md4_gg(a, b, c, d, x[i+ 3], 3 );
        d = this.md4_gg(d, a, b, c, x[i+ 7], 5 );
        c = this.md4_gg(c, d, a, b, x[i+11], 9 );
        b = this.md4_gg(b, c, d, a, x[i+15], 13);

        a = this.md4_hh(a, b, c, d, x[i+ 0], 3 );
        d = this.md4_hh(d, a, b, c, x[i+ 8], 9 );
        c = this.md4_hh(c, d, a, b, x[i+ 4], 11);
        b = this.md4_hh(b, c, d, a, x[i+12], 15);
        a = this.md4_hh(a, b, c, d, x[i+ 2], 3 );
        d = this.md4_hh(d, a, b, c, x[i+10], 9 );
        c = this.md4_hh(c, d, a, b, x[i+ 6], 11);
        b = this.md4_hh(b, c, d, a, x[i+14], 15);
        a = this.md4_hh(a, b, c, d, x[i+ 1], 3 );
        d = this.md4_hh(d, a, b, c, x[i+ 9], 9 );
        c = this.md4_hh(c, d, a, b, x[i+ 5], 11);
        b = this.md4_hh(b, c, d, a, x[i+13], 15);
        a = this.md4_hh(a, b, c, d, x[i+ 3], 3 );
        d = this.md4_hh(d, a, b, c, x[i+11], 9 );
        c = this.md4_hh(c, d, a, b, x[i+ 7], 11);
        b = this.md4_hh(b, c, d, a, x[i+15], 15);

        a = this.safe_add(a, olda);
        b = this.safe_add(b, oldb);
        c = this.safe_add(c, oldc);
        d = this.safe_add(d, oldd);

    }
    return Array(a, b, c, d);
  }

  md4_cmn(q, a, b, x, s, t)
  {
    return this.safe_add(this.rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
  }
  md4_ff(a, b, c, d, x, s)
  {
    return this.md4_cmn((b & c) | ((~b) & d), a, 0, x, s, 0);
  }
  md4_gg(a, b, c, d, x, s)
  {
    return this.md4_cmn((b & c) | (b & d) | (c & d), a, 0, x, s, 1518500249);
  }
  md4_hh(a, b, c, d, x, s)
  {
    return this.md4_cmn(b ^ c ^ d, a, 0, x, s, 1859775393);
  }

  safe_add(x, y)
  {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  rol(num, cnt)
  {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  str2binl(str)
  {
    let bin = Array();
    let mask = (1 << this.chrsz) - 1;
    for(let i = 0; i < str.length * this.chrsz; i += this.chrsz)
        bin[i>>5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i%32);
    return bin;
  }

  binl2str(bin)
  {
    let str = "";
    let mask = (1 << this.chrsz) - 1;
    for(let i = 0; i < bin.length * 32; i += this.chrsz)
        str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
    return str;
  }

  //Paul Tero, July 2001
  //http://www.tero.co.uk/des/
  //
  //Optimised for performance with large blocks by Michael Hayworth, November 2001
  //http://www.netdealing.com
  //
  //THIS SOFTWARE IS PROVIDED "AS IS" AND
  //ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  //IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  //ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
  //FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  //DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
  //OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
  //HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
  //LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
  //OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
  //SUCH DAMAGE.

  //des
  //this takes the key, the message, and whether to encrypt or decrypt
  des (key, message, encrypt, mode, iv?: any, padding?: any) {
    //declaring this locally speeds things up a bit
    let spfunction1 = new Array (0x1010400,0,0x10000,0x1010404,0x1010004,0x10404,0x4,0x10000,0x400,0x1010400,0x1010404,0x400,0x1000404,0x1010004,0x1000000,0x4,0x404,0x1000400,0x1000400,0x10400,0x10400,0x1010000,0x1010000,0x1000404,0x10004,0x1000004,0x1000004,0x10004,0,0x404,0x10404,0x1000000,0x10000,0x1010404,0x4,0x1010000,0x1010400,0x1000000,0x1000000,0x400,0x1010004,0x10000,0x10400,0x1000004,0x400,0x4,0x1000404,0x10404,0x1010404,0x10004,0x1010000,0x1000404,0x1000004,0x404,0x10404,0x1010400,0x404,0x1000400,0x1000400,0,0x10004,0x10400,0,0x1010004);
    let spfunction2 = new Array (-0x7fef7fe0,-0x7fff8000,0x8000,0x108020,0x100000,0x20,-0x7fefffe0,-0x7fff7fe0,-0x7fffffe0,-0x7fef7fe0,-0x7fef8000,-0x80000000,-0x7fff8000,0x100000,0x20,-0x7fefffe0,0x108000,0x100020,-0x7fff7fe0,0,-0x80000000,0x8000,0x108020,-0x7ff00000,0x100020,-0x7fffffe0,0,0x108000,0x8020,-0x7fef8000,-0x7ff00000,0x8020,0,0x108020,-0x7fefffe0,0x100000,-0x7fff7fe0,-0x7ff00000,-0x7fef8000,0x8000,-0x7ff00000,-0x7fff8000,0x20,-0x7fef7fe0,0x108020,0x20,0x8000,-0x80000000,0x8020,-0x7fef8000,0x100000,-0x7fffffe0,0x100020,-0x7fff7fe0,-0x7fffffe0,0x100020,0x108000,0,-0x7fff8000,0x8020,-0x80000000,-0x7fefffe0,-0x7fef7fe0,0x108000);
    let spfunction3 = new Array (0x208,0x8020200,0,0x8020008,0x8000200,0,0x20208,0x8000200,0x20008,0x8000008,0x8000008,0x20000,0x8020208,0x20008,0x8020000,0x208,0x8000000,0x8,0x8020200,0x200,0x20200,0x8020000,0x8020008,0x20208,0x8000208,0x20200,0x20000,0x8000208,0x8,0x8020208,0x200,0x8000000,0x8020200,0x8000000,0x20008,0x208,0x20000,0x8020200,0x8000200,0,0x200,0x20008,0x8020208,0x8000200,0x8000008,0x200,0,0x8020008,0x8000208,0x20000,0x8000000,0x8020208,0x8,0x20208,0x20200,0x8000008,0x8020000,0x8000208,0x208,0x8020000,0x20208,0x8,0x8020008,0x20200);
    let spfunction4 = new Array (0x802001,0x2081,0x2081,0x80,0x802080,0x800081,0x800001,0x2001,0,0x802000,0x802000,0x802081,0x81,0,0x800080,0x800001,0x1,0x2000,0x800000,0x802001,0x80,0x800000,0x2001,0x2080,0x800081,0x1,0x2080,0x800080,0x2000,0x802080,0x802081,0x81,0x800080,0x800001,0x802000,0x802081,0x81,0,0,0x802000,0x2080,0x800080,0x800081,0x1,0x802001,0x2081,0x2081,0x80,0x802081,0x81,0x1,0x2000,0x800001,0x2001,0x802080,0x800081,0x2001,0x2080,0x800000,0x802001,0x80,0x800000,0x2000,0x802080);
    let spfunction5 = new Array (0x100,0x2080100,0x2080000,0x42000100,0x80000,0x100,0x40000000,0x2080000,0x40080100,0x80000,0x2000100,0x40080100,0x42000100,0x42080000,0x80100,0x40000000,0x2000000,0x40080000,0x40080000,0,0x40000100,0x42080100,0x42080100,0x2000100,0x42080000,0x40000100,0,0x42000000,0x2080100,0x2000000,0x42000000,0x80100,0x80000,0x42000100,0x100,0x2000000,0x40000000,0x2080000,0x42000100,0x40080100,0x2000100,0x40000000,0x42080000,0x2080100,0x40080100,0x100,0x2000000,0x42080000,0x42080100,0x80100,0x42000000,0x42080100,0x2080000,0,0x40080000,0x42000000,0x80100,0x2000100,0x40000100,0x80000,0,0x40080000,0x2080100,0x40000100);
    let spfunction6 = new Array (0x20000010,0x20400000,0x4000,0x20404010,0x20400000,0x10,0x20404010,0x400000,0x20004000,0x404010,0x400000,0x20000010,0x400010,0x20004000,0x20000000,0x4010,0,0x400010,0x20004010,0x4000,0x404000,0x20004010,0x10,0x20400010,0x20400010,0,0x404010,0x20404000,0x4010,0x404000,0x20404000,0x20000000,0x20004000,0x10,0x20400010,0x404000,0x20404010,0x400000,0x4010,0x20000010,0x400000,0x20004000,0x20000000,0x4010,0x20000010,0x20404010,0x404000,0x20400000,0x404010,0x20404000,0,0x20400010,0x10,0x4000,0x20400000,0x404010,0x4000,0x400010,0x20004010,0,0x20404000,0x20000000,0x400010,0x20004010);
    let spfunction7 = new Array (0x200000,0x4200002,0x4000802,0,0x800,0x4000802,0x200802,0x4200800,0x4200802,0x200000,0,0x4000002,0x2,0x4000000,0x4200002,0x802,0x4000800,0x200802,0x200002,0x4000800,0x4000002,0x4200000,0x4200800,0x200002,0x4200000,0x800,0x802,0x4200802,0x200800,0x2,0x4000000,0x200800,0x4000000,0x200800,0x200000,0x4000802,0x4000802,0x4200002,0x4200002,0x2,0x200002,0x4000000,0x4000800,0x200000,0x4200800,0x802,0x200802,0x4200800,0x802,0x4000002,0x4200802,0x4200000,0x200800,0,0x2,0x4200802,0,0x200802,0x4200000,0x800,0x4000002,0x4000800,0x800,0x200002);
    let spfunction8 = new Array (0x10001040,0x1000,0x40000,0x10041040,0x10000000,0x10001040,0x40,0x10000000,0x40040,0x10040000,0x10041040,0x41000,0x10041000,0x41040,0x1000,0x40,0x10040000,0x10000040,0x10001000,0x1040,0x41000,0x40040,0x10040040,0x10041000,0x1040,0,0,0x10040040,0x10000040,0x10001000,0x41040,0x40000,0x41040,0x40000,0x10041000,0x1000,0x40,0x10040040,0x1000,0x41040,0x10001000,0x40,0x10000040,0x10040000,0x10040040,0x10000000,0x40000,0x10001040,0,0x10041040,0x40040,0x10000040,0x10040000,0x10001000,0x10001040,0,0x10041040,0x41000,0x41000,0x1040,0x1040,0x40040,0x10000000,0x10041000);

    //create the 16 or 48 subkeys we will need
    let keys = this.des_createKeys (key);
    let m=0, i, j, temp/*, temp2*/, right1, right2, left, right, looping;
    let cbcleft, cbcleft2, cbcright, cbcright2
    let endloop, loopinc;
    let len = message.length;
    let chunk = 0;
    //set up the loops for single and triple des
    let iterations = keys.length == 32 ? 3 : 9; //single or triple des
    if (iterations == 3) {looping = encrypt ? new Array (0, 32, 2) : new Array (30, -2, -2);}
    else {looping = encrypt ? new Array (0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array (94, 62, -2, 32, 64, 2, 30, -2, -2);}

    //pad the message depending on the padding parameter
    if (padding == 2) message += "        "; //pad the message with spaces
    else if (padding == 1) {temp = 8-(len%8); message += String.fromCharCode (temp,temp,temp,temp,temp,temp,temp,temp); if (temp==8) len+=8;} //PKCS7 padding
    else if (!padding) message += "\0\0\0\0\0\0\0\0"; //pad the message out with null bytes

    //store the result here
    let result = "";
    let tempresult = "";

    if (mode == 1) { //CBC mode
        cbcleft = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
        cbcright = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);
        m=0;
    }

    //loop through each 64 bit chunk of the message
    while (m < len) {
        left = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);
        right = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);

        //for Cipher Block Chaining mode, xor the message with the previous result
        if (mode == 1) {if (encrypt) {left ^= cbcleft; right ^= cbcright;} else {cbcleft2 = cbcleft; cbcright2 = cbcright; cbcleft = left; cbcright = right;}}

        //first each 64 but chunk of the message must be permuted according to IP
        temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);
        temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);
        temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);
        temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
        temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);

        left = ((left << 1) | (left >>> 31));
        right = ((right << 1) | (right >>> 31));

        //do this either 1 or 3 times for each chunk of the message
        for (j=0; j<iterations; j+=3) {
            endloop = looping[j+1];
            loopinc = looping[j+2];
            //now go through and perform the encryption or decryption
            for (i=looping[j]; i!=endloop; i+=loopinc) { //for efficiency
                right1 = right ^ keys[i];
                right2 = ((right >>> 4) | (right << 28)) ^ keys[i+1];
                //the result is attained by passing these bytes through the S selection functions
                temp = left;
                left = right;
                right = temp ^ (spfunction2[(right1 >>> 24) & 0x3f] | spfunction4[(right1 >>> 16) & 0x3f]
                    | spfunction6[(right1 >>>  8) & 0x3f] | spfunction8[right1 & 0x3f]
                    | spfunction1[(right2 >>> 24) & 0x3f] | spfunction3[(right2 >>> 16) & 0x3f]
                    | spfunction5[(right2 >>>  8) & 0x3f] | spfunction7[right2 & 0x3f]);
            }
            temp = left; left = right; right = temp; //unreverse left and right
        } //for either 1 or 3 iterations

        //move then each one bit to the right
        left = ((left >>> 1) | (left << 31));
        right = ((right >>> 1) | (right << 31));

        //now perform IP-1, which is IP in the opposite direction
        temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
        temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
        temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);
        temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);
        temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);

        //for Cipher Block Chaining mode, xor the message with the previous result
        if (mode == 1) {if (encrypt) {cbcleft = left; cbcright = right;} else {left ^= cbcleft2; right ^= cbcright2;}}
        tempresult += String.fromCharCode ((left>>>24), ((left>>>16) & 0xff), ((left>>>8) & 0xff), (left & 0xff), (right>>>24), ((right>>>16) & 0xff), ((right>>>8) & 0xff), (right & 0xff));

        chunk += 8;
        if (chunk == 512) {result += tempresult; tempresult = ""; chunk = 0;}
    } //for every 8 characters, or 64 bits in the message

    //return the result as an array
    return result + tempresult;
  } //end of des



  //des_createKeys
  //this takes as input a 64 bit key (even though only 56 bits are used)
  //as an array of 2 integers, and returns 16 48 bit keys
  des_createKeys (key) {
    //declaring this locally speeds things up a bit
    let pc2bytes0  = new Array (0,0x4,0x20000000,0x20000004,0x10000,0x10004,0x20010000,0x20010004,0x200,0x204,0x20000200,0x20000204,0x10200,0x10204,0x20010200,0x20010204);
    let pc2bytes1  = new Array (0,0x1,0x100000,0x100001,0x4000000,0x4000001,0x4100000,0x4100001,0x100,0x101,0x100100,0x100101,0x4000100,0x4000101,0x4100100,0x4100101);
    let pc2bytes2  = new Array (0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808,0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808);
    let pc2bytes3  = new Array (0,0x200000,0x8000000,0x8200000,0x2000,0x202000,0x8002000,0x8202000,0x20000,0x220000,0x8020000,0x8220000,0x22000,0x222000,0x8022000,0x8222000);
    let pc2bytes4  = new Array (0,0x40000,0x10,0x40010,0,0x40000,0x10,0x40010,0x1000,0x41000,0x1010,0x41010,0x1000,0x41000,0x1010,0x41010);
    let pc2bytes5  = new Array (0,0x400,0x20,0x420,0,0x400,0x20,0x420,0x2000000,0x2000400,0x2000020,0x2000420,0x2000000,0x2000400,0x2000020,0x2000420);
    let pc2bytes6  = new Array (0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002,0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002);
    let pc2bytes7  = new Array (0,0x10000,0x800,0x10800,0x20000000,0x20010000,0x20000800,0x20010800,0x20000,0x30000,0x20800,0x30800,0x20020000,0x20030000,0x20020800,0x20030800);
    let pc2bytes8  = new Array (0,0x40000,0,0x40000,0x2,0x40002,0x2,0x40002,0x2000000,0x2040000,0x2000000,0x2040000,0x2000002,0x2040002,0x2000002,0x2040002);
    let pc2bytes9  = new Array (0,0x10000000,0x8,0x10000008,0,0x10000000,0x8,0x10000008,0x400,0x10000400,0x408,0x10000408,0x400,0x10000400,0x408,0x10000408);
    let pc2bytes10 = new Array (0,0x20,0,0x20,0x100000,0x100020,0x100000,0x100020,0x2000,0x2020,0x2000,0x2020,0x102000,0x102020,0x102000,0x102020);
    let pc2bytes11 = new Array (0,0x1000000,0x200,0x1000200,0x200000,0x1200000,0x200200,0x1200200,0x4000000,0x5000000,0x4000200,0x5000200,0x4200000,0x5200000,0x4200200,0x5200200);
    let pc2bytes12 = new Array (0,0x1000,0x8000000,0x8001000,0x80000,0x81000,0x8080000,0x8081000,0x10,0x1010,0x8000010,0x8001010,0x80010,0x81010,0x8080010,0x8081010);
    let pc2bytes13 = new Array (0,0x4,0x100,0x104,0,0x4,0x100,0x104,0x1,0x5,0x101,0x105,0x1,0x5,0x101,0x105);

    //how many iterations (1 for des, 3 for triple des)
    let iterations = key.length > 8 ? 3 : 1; //changed by Paul 16/6/2007 to use Triple DES for 9+ byte keys
    //stores the return keys
    let keys = new Array (32 * iterations);
    //now define the left shifts which need to be done
    let shifts = new Array (0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);
    //other variables
    let lefttemp, righttemp, m=0, n=0, temp;

    for (let j=0; j<iterations; j++) { //either 1 or 3 iterations
        let left = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);
        let right = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);

        temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);
        temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);
        temp = ((left >>> 2) ^ right) & 0x33333333; right ^= temp; left ^= (temp << 2);
        temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);
        temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);
        temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);
        temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);

        //the right side needs to be shifted and to get the last four bits of the left side
        temp = (left << 8) | ((right >>> 20) & 0x000000f0);
        //left needs to be put upside down
        left = (right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0);
        right = temp;

        //now go through and perform these shifts on the left and right keys
        for (var i=0; i < shifts.length; i++) {
            //shift the keys either one or two bits to the left
            if (shifts[i]) {left = (left << 2) | (left >>> 26); right = (right << 2) | (right >>> 26);}
            else {left = (left << 1) | (left >>> 27); right = (right << 1) | (right >>> 27);}
            left &= -0xf; right &= -0xf;

            //now apply PC-2, in such a way that E is easier when encrypting or decrypting
            //this conversion will look like PC-2 except only the last 6 bits of each byte are used
            //rather than 48 consecutive bits and the order of lines will be according to
            //how the S selection functions will be applied: S2, S4, S6, S8, S1, S3, S5, S7
            lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]
                | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]
                | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]
                | pc2bytes6[(left >>> 4) & 0xf];
            righttemp = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]
                | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]
                | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]
                | pc2bytes13[(right >>> 4) & 0xf];
            temp = ((righttemp >>> 16) ^ lefttemp) & 0x0000ffff;
            keys[n++] = lefttemp ^ temp; keys[n++] = righttemp ^ (temp << 16);
        }
    } //for each iterations
    //return the keys we've created
    return keys;
  } //end of des_createKeys


}

@Injectable()
export class AuthenticatedSoapService {

  private user: string = '';
  private password: string = '';
  private ntdomain: string = CONSTANTS.MAIN_DOMAIN;

  private ntlm: NTLM;

  private debug: boolean = false;

  private envelopeBuilder_:(requestBody: string, predicate: string, method: string, targetNamespace: string) => string = null;


  constructor (private http: Http, private serviceUrl: string, private targetNamespace: string) {
    this.ntlm = new NTLM;
  }

  set envelopeBuilder(envelopeBuilder:(response:{}, predicate: string, method: string, targetNamespace: string) => string) {
    this.envelopeBuilder_ = envelopeBuilder;
  }

  set debugMode(on: boolean) {
    this.debug = on;
  }

  get debugMode() {
    return this.debug;
  }

  setAuth(user: string, password: string): void {
    this.user = user;
    this.password = password;
    this.ntlm.setCredentials(this.ntdomain, this.user, this.password);
  }

  private createHeaders(headers: Headers, method: string): void {
    headers.append('Content-Type', 'application/xml');
    headers.append('SOAPAction', this.targetNamespace + '/' + method);
  }

  post(predicate: string, method: string, responseRoot: string, body: any, debugText?: any): Observable<any> {
    if (!this.serviceUrl) { return null; }
    if (!this.envelopeBuilder_) { return null; }
    if (this.debugMode) this.debugMode = true;

    let request: string = this.toXml(body, predicate);
    let envelopedRequest: string = null != this.envelopeBuilder_ ? this.envelopeBuilder_(request, predicate, method, this.targetNamespace) : request;

    if (this.debugMode) {
      console.log('target namespace: ', this.targetNamespace);
      console.log('method: ', method);
      console.log('service URL: ', this.serviceUrl);
      console.log('request: ', request);
      console.log('envelopedRequest: ', envelopedRequest);
      console.log('user: ', this.user);
      console.log('password: ', this.password);
    }

    let hostname = new URL(this.serviceUrl).hostname;
    let headers = new Headers()
    this.createHeaders(headers, method);
    let hdrAuth = this.ntlm.createMessage1(hostname).toBase64();
    headers.append("Authorization", 'NTLM ' + hdrAuth );
    // headers.append("Authorization", 'Basic ' + btoa(this.user + ':' + this.password) );
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: CONSTANTS.MAIN_URL,
      headers: headers,
      withCredentials: true,
    });
    if (this.debugMode) {
      console.log('Options (1):', options);
      debugText.debugText += "authenticatedSoap.post(url='" + options.url + "', hdrAuth='" + options.headers.get("Authorization") + "'..) ";
      debugger;
    }

    return Observable.create( observer => {
      if (this.debugMode) debugText.debugText += "Observable.create(this.http.post(url='" + options.url + "',..)..) ";
      this.http.post(this.serviceUrl, envelopedRequest, options)
        .subscribe(
          (res1: Response) => {
            if (this.debugMode) debugText.debugText += "Observable.create(post).subscribe(result => ..) ";
            return this.convert(res1, responseRoot, debugText)
                        .subscribe(
                          (res: Response) => {
                            if (this.debugMode) {
                              debugText.debugText += "this.convert.1(result => '" + res + "'..) ";
                              debugger;
                            }
                            observer.next(res);
                            observer.complete();
                          },
                          (err) => {
                            if (this.debugMode) {
                              debugText.debugText += "this.convert.2(error => '" + err + "'..) ";
                              debugger;
                            }
                            observer.error(err);
                            observer.complete();
                          }
                        )
            ;
          },
          (err1) => {
            if (this.debugMode) {
              debugText.debugText += "Observable.create(post).subscribe(error => '" + err1.status + "', hdrAuth='" + err1.headers.get('www-authenticate')+ "'..) ";
              console.error('Error: ' + err1);
            }

            if (err1.status === 401) {
              if (this.debugMode) { debugger; }
              let headers = new Headers();
              this.createHeaders(headers, method);
              let response = err1.headers.get('www-authenticate');
              let challenge = this.ntlm.getChallenge(response);
              let hdrAuth = this.ntlm.createMessage3(challenge, hostname);
              headers.append('Authorization', 'NTLM ' + hdrAuth.toBase64());
              let options = new RequestOptions({
                method: RequestMethod.Post,
                url: CONSTANTS.MAIN_URL,
                headers: headers,
                withCredentials: true,
              });
              if (this.debugMode) {
                console.log('Options (3):', options);
                console.log('Headers (3):', headers);
                debugText.debugText += "Authorization2(error => '" + err1 + "', hdrAuth='" + hdrAuth.toBase64() + "'..) ";
                debugger;
              }

              this.http.post(this.serviceUrl, envelopedRequest, options)
                .subscribe(
                  (res2: Response) => {
                    if (this.debugMode) {
                      debugText.debugText += "Authorization3(result => '" + res2 + "'..) ";
                      debugger;
                    }
                    if (this.debugMode) console.log('Response (2):', res2);
                    return this.convert(res2, responseRoot, debugText)
                                .subscribe(
                                  (res) => {
                                    if (this.debugMode) {
                                      debugText.debugText += "this.convert.9(result => '" + res + "'..) ";
                                      debugger;
                                    }
                                    observer.next(res);
                                    observer.complete();
                                  },
                                  (err) => {
                                    if (this.debugMode) {
                                      debugText.debugText += "this.convert.10(error => '" + err + "', '" + err1 + "'..) ";
                                      debugger;
                                    }
                                    observer.error(err1);
                                    observer.complete();
                                  }
                                )
                    ;
                  },
                  (err2) => {
                    return this.convert(err2, responseRoot, debugText)
                                .subscribe(
                                  (res) => {
                                    if (this.debugMode) {
                                      debugText.debugText += "this.convert.7(result => '" + res + "'..) ";
                                      debugger;
                                    }
                                    observer.error(res);
                                    observer.complete();
                                  },
                                  (err) => {
                                    if (this.debugMode) {
                                      debugText.debugText += "this.convert.8(error => '" + err + "', '" + err2 + "'..) ";
                                      debugger;
                                    }
                                    observer.error(err2);
                                    observer.complete();
                                  }
                                )
                    ;
                  }
                );

            } else {
              return this.convert(err1, responseRoot, debugText)
                          .subscribe(
                            (res) => {
                              if (this.debugMode) {
                                debugText.debugText += "this.convert.5(result => '" + res + "'..) ";
                                debugger;
                              }
                              observer.error(res);
                              observer.complete();
                            },
                            (err) => {
                              if (this.debugMode) {
                                debugText.debugText += "this.convert.6(error => '" + err + "', '" + err1 + "'..) ";
                                debugger;
                              }
                              observer.error(err1);
                              observer.complete();
                            }
                          )
              ;
            }
          }
        )
    });

  }


  /*
   *
   * SOAP
   *
   */
  private convert(data: Response, responseRoot?: string, debugText?: any): Observable<any> {

    return Observable.create( observer => {
        new xml2js.Parser({
          normalizeTags: true,
          tagNameProcessors: [ processors.stripPrefix ],
          valueNameProcessors: [ processors.parseBooleans, processors.parseNumbers ],
          xmlns: false,
          explicitArray: false,
          explicitChildren: false,
          mergeAttrs: false,
        })
        .parseString( data.text(), (err, result) => {
            if (null !== err) {
              if (this.debugMode) {
                console.error('Error (convert): ', err);
                debugText.debugText += "convert(Observable.create(xml2js.parseString(error => '" + err + "'...)) ";
              }
              observer.error(err);
              observer.complete();
              return;
            }
            if (this.debugMode) {
              console.log('Result (convert): ', result);
              debugText.debugText += "convert(Observable.create(xml2js.parseString(result => '" + result + "'...)) ";
            }
            observer.next(result);
            observer.complete();
          }
        )
      }
    );

  }

  private toXml(parameters:any, predicate?: string):string {
      let xml: string = "";
      let parameter: any;

      switch (typeof(parameters)) {
          case "string":
              xml += parameters.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
              break;

          case "number":
          case "boolean":
              xml += parameters.toString();
              break;

          case "object":
              if (parameters.constructor.toString().indexOf("function Date()") > -1) {
                  let year:string = parameters.getFullYear().toString();
                  let month:string = ("0" + (parameters.getMonth() + 1).toString()).slice(-2);
                  let date:string = ("0" + parameters.getDate().toString()).slice(-2);
                  let hours:string = ("0" + parameters.getHours().toString()).slice(-2);
                  let minutes:string = ("0" + parameters.getMinutes().toString()).slice(-2);
                  let seconds:string = ("0" + parameters.getSeconds().toString()).slice(-2);
                  let milliseconds:string = parameters.getMilliseconds().toString();

                  let tzOffsetMinutes:number = Math.abs(parameters.getTimezoneOffset());
                  let tzOffsetHours:number = 0;

                  while (tzOffsetMinutes >= 60) {
                      tzOffsetHours++;
                      tzOffsetMinutes -= 60;
                  }

                  let tzMinutes:string = ("0" + tzOffsetMinutes.toString()).slice(-2);
                  let tzHours:string = ("0" + tzOffsetHours.toString()).slice(-2);

                  let timezone:string = ((parameters.getTimezoneOffset() < 0) ? "-" : "+") + tzHours + ":" + tzMinutes;

                  xml += year + "-" + month + "-" + date + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + timezone;
              }
              else if (parameters.constructor.toString().indexOf("function Array()") > -1) { // Array
                  for (parameter in parameters) {
                      if (parameters.hasOwnProperty(parameter)) {
                          if (!isNaN(parameter)) {  // linear array
                              (/function\s+(\w*)\s*\(/ig).exec(parameters[parameter].constructor.toString());

                              let type = RegExp.$1;

                              switch (type) {
                                  case "":
                                      type = typeof(parameters[parameter]);
                                      break;
                                  case "String":
                                      type = "string";
                                      break;
                                  case "Number":
                                      type = "int";
                                      break;
                                  case "Boolean":
                                      type = "bool";
                                      break;
                                  case "Date":
                                      type = "DateTime";
                                      break;
                              }
                              xml += this.toElement(type, parameters[parameter], predicate);
                          }
                          else { // associative array
                              xml += this.toElement(parameter, parameters[parameter], predicate);
                          }
                      }
                  }
              }
              else { // Object or custom function
                  for (parameter in parameters) {
                      if (parameters.hasOwnProperty(parameter)) {
                          xml += this.toElement(parameter, parameters[parameter], predicate);
                      }
                  }
              }
              break;

          default:
              throw new Error("SoapService error: type '" + typeof(parameters) + "' is not supported");
      }

      return xml;
  }

  private toElement(tagNamePotentiallyWithAttributes:string, parameters:any, predicate?: string):string {
      let elementContent: string = this.toXml(parameters, predicate);

      if (undefined !== predicate) { predicate += ':'; } else { predicate = ''; }

      if ("" == elementContent) {
          return "<" + predicate + tagNamePotentiallyWithAttributes + "/>";
      }
      else {
          return "<" + predicate + tagNamePotentiallyWithAttributes + ">" + elementContent + "</" + predicate + AuthenticatedSoapService.stripTagAttributes(tagNamePotentiallyWithAttributes) + ">";
      }
  }

  private static stripTagAttributes(tagNamePotentiallyWithAttributes:string):string {
      tagNamePotentiallyWithAttributes = tagNamePotentiallyWithAttributes + ' ';

      return tagNamePotentiallyWithAttributes.slice(0, tagNamePotentiallyWithAttributes.indexOf(' '));
  }

}


export const AUTHENTICATED_SOAP_SERVICE = {
    provide: AuthenticatedSoapService,
    useFactory: (backend: XHRBackend, options: RequestOptions) => {
        // return new AuthenticatedSoapService(backend, options);
        return new AuthenticatedSoapService(new Http(backend, options), CONSTANTS.MAIN_URL, CONSTANTS.MAIN_NAMESPACE );
    },
    deps: [XHRBackend, RequestOptions]
};

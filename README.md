### Примерные настройки IIS 8.5:

#### В корне сайта web.config:

```
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.web>
        <authentication mode="Windows" />
	<authorization>
	  <allow users="?" />
	</authorization>
        <sessionState mode="Off" />
        <profile enabled="false" />
    </system.web>
    <system.webServer>
	<httpErrors errorMode="Detailed" />
        <httpProtocol>
            <customHeaders>
                <add name="Access-Control-Allow-Credentials" value="true" />
                <add name="Access-Control-Allow-Headers" value="SOAPAction, Authorization, Accept, Accept-Language, Content-Type, X-Requested-With" />
                <add name="Access-Control-Allow-Methods" value="GET, POST, OPTIONS" />
                <add name="Access-Control-Expose-Headers" value="WWW-Authenticate" />
            </customHeaders>
        </httpProtocol>
	<httpRedirect enabled="false" />
	<rewrite>
        <rules>
            <rule name="Capture Origin Header" enabled="true"> 
                    	<match url=".*" /> 
                    	<conditions>
	                        <add input="{HTTP_ORIGIN}" pattern=".+" /> 
                    	</conditions> 
                    	<serverVariables>
                        <set name="CAPTURED_ORIGIN" value="{C:0}" /> 
                    	</serverVariables> 
                    	<action type="None" /> 
                </rule>
                <rule name="OPTIONS" stopProcessing="true">
                    <match url=".*" />
                    <conditions>
                        <add input="{REQUEST_METHOD}" pattern="OPTIONS" />
                    </conditions>
                    <action type="CustomResponse" statusCode="200" statusReason="OK" statusDescription="OK OPTIONS" />
                </rule>
                <rule name="LetsEncrypt Rule" stopProcessing="true">
                    <match url="^\.well-known.*$" />
                    <action type="None" />
            </rule>
            <rule name="Canonical Host Name" enabled="true" stopProcessing="true"> 
                <match url="(.*)" /> 
    			<conditions>
                        <add input="{HTTP_HOST}" pattern="^[HOST]$" negate="true" /> 
    			</conditions> 
    			<action type="Redirect" url="https://[HOST]/{R:1}" redirectType="Permanent" /> 
    		</rule>
            <rule name="HTTP to HTTPS redirect" enabled="false" stopProcessing="true">
    			<match url="(.*)" />
    			<conditions>
                        <add input="{HTTPS}" pattern="off" ignoreCase="true" />
    			</conditions>
    			<action type="Redirect" url="https://[HOST]:445/{R:1}" redirectType="Permanent" />
        	</rule>
	    </rules>
	    <outboundRules>
    		<rule name="Add Strict-Transport-Security when HTTPS" enabled="true">
                <match serverVariable="RESPONSE_Strict-Transport-Security" pattern=".*" />
                <conditions>
                    <add input="{HTTPS}" pattern="on" ignoreCase="true" />
                </conditions>
                <action type="Rewrite" value="max-age=31536000; includeSubDomains; preload" />
    		</rule>
            <rule name="Set-Access-Control-Allow-Origin for known origins" enabled="true"> 
                <match serverVariable="RESPONSE_Access-Control-Allow-Origin" pattern=".+" negate="true" /> 
                <conditions>
                    <add input="{AllowedOrigins:{CAPTURED_ORIGIN}}" pattern=".+" /> 
                </conditions> 
                <action type="Rewrite" value="{C:0}" /> 
            </rule> 
	    </outboundRules>
		<rewriteMaps> 
            <rewriteMap name="AllowedOrigins"> 
                	<add key="https://[HOST]" value="https://[HOST]" /> 
                	<add key="http://localhost:8100" value="http://localhost:8100" />
                	<add key="http://localhost:8101" value="http://localhost:8101" />
            </rewriteMap> 
        </rewriteMaps> 
	</rewrite>
	<tracing>
	        <traceFailedRequests>
	            <add path="*">
	                <traceAreas>
	                    <add provider="WWW Server" areas="Rewrite" verbosity="Verbose" />
	                </traceAreas>
	                <failureDefinitions timeTaken="00:00:00" statusCodes="500" verbosity="Error" />
	            </add>
	        </traceFailedRequests>
	</tracing>
    <defaultDocument>
        <files>
            <clear />
            <add value="index.html" />
            <add value="index.php" />
        </files>
    </defaultDocument>
    <handlers>
    </handlers>
    </system.webServer>
    <location path="sd">
    </location>
</configuration>
```

#### В C:\Windows\System32\inetsrv\config\applicationHost.config: ####

```
<configuration>
    
    <system.webServer>

        <rewrite>
            <globalRules>
            </globalRules>
        <allowedServerVariables>
                    <add name="CAPTURED_ORIGIN" />
                    <add name="RESPONSE_Access-Control-Allow-Origin" />
            <add name="RESPONSE_Strict-Transport-Security" />
                </allowedServerVariables>
        </rewrite>

        ...

    </system.webServer>

    ...

</configuration>
```

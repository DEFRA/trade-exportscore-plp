# MDM API Integration

## Overview

This integration enables the PLP service to connect to the MDM (Master Data Management) API through the Trade APIM endpoint to retrieve NIRMS (Northern Ireland Retail Movement Scheme) prohibited items data.

## Implementation Summary

### Files Created/Modified

#### New Files:

1. **`app/config/mdm-config.js`** - MDM API configuration
2. **`app/services/mdm-service.js`** - Service for interacting with MDM API
3. **`app/routes/test-mdm-conn.js`** - Test endpoint for MDM connectivity
4. **`test/unit/config/mdm-config.test.js`** - Config unit tests
5. **`test/unit/services/mdm-service.test.js`** - Service unit tests (12 tests)

#### Modified Files:

1. **`app/config/index.js`** - Added mdmConfig export
2. **`app/plugins/router.js`** - Registered test-mdm-conn route
3. **`appConfig/appConfig.yaml`** - Added MDM_API_URL and MDM_SUBSCRIPTION_KEY
4. **`test/unit/plugins/router.test.js`** - Updated router tests

### Configuration

**Environment Variables:**

```yaml
MDM_API_URL: "{{servicename}}-MDM-API-URL"
MDM_SUBSCRIPTION_KEY: "{{servicename}}-MDM-SUBSCRIPTION-KEY"
MDM_TENANT: "{{servicename}}-MDM-TENANT"
MDM_AUTH_URL: "{{servicename}}-MDM-AUTH-URL"
MDM_CLIENT_ID: "{{servicename}}-MDM-CLIENT-ID"
MDM_CLIENT_SECRET: "{{servicename}}-MDM-CLIENT-SECRET"
MDM_SCOPE: "{{servicename}}-MDM-SCOPE"
```

**Example Values (TST environment):**

- API URL: `https://tst-internal-gateway.trade.azure.defra.cloud/mdm`
- Auth URL: `https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token`
- Scope: `api://tst-futuretrade-int.defra.gov.uk/.default`

### API Endpoint

**Test Endpoint:** `GET /test-mdm-conn`

- Returns NIRMS prohibited items data from MDM API
- Returns 200 OK on success with JSON data
- Returns 503 Service Unavailable on failure

### Service Features

The `mdm-service.js` includes:

- **Retry Logic**: Automatically retries failed requests (default: 3 attempts with 2s delay)
- **Error Handling**: Comprehensive error logging and graceful degradation
- **Network Resilience**: Only retries on network errors, not HTTP errors
- **Logging**: Detailed info and error logging throughout

### Usage Example

```javascript
const { getNirmsProhibitedItems } = require("./app/services/mdm-service");

// Get NIRMS data from MDM API
const data = await getNirmsProhibitedItems();

if (data) {
  // Process the prohibited items data
  console.log("Retrieved NIRMS data:", data);
} else {
  // Handle error case
  console.error("Failed to retrieve NIRMS data");
}

// Custom retry parameters
const dataWithCustomRetry = await getNirmsProhibitedItems(5, 3000); // 5 retries, 3s delay
```

### Authentication

Configured with **OAuth 2.0 Client Credentials + APIM Subscription Key**:

- **OAuth Flow**: Client credentials grant type
- **Bearer Token**: Retrieved from Azure AD token endpoint before each API call
- **APIM Header**: `Ocp-Apim-Subscription-Key` required for APIM gateway
- **Token Scope**: Application-specific scope for Future Trade API

### Testing

**Run MDM tests:**

```bash
npm test -- --testPathPattern="mdm"
```

**Test connectivity:**

```bash
# Start the service
npm start

# Test the endpoint
curl http://localhost:3000/test-mdm-conn
```

### API Endpoint Details

**Full API Path:**

```
{MDM_API_URL}/trade/nirms/prohibited-items
```

### Network Requirements

- Service must have network connectivity to the internal gateway endpoint
- Internal gateway endpoint requires VNet access or proper network configuration
- Ensure DNS resolution is configured correctly
- OAuth token endpoint must be accessible (login.microsoftonline.com)

### Future Enhancements

1. **Caching**: Implement caching strategy for NIRMS data (infrequent changes)
2. **Token Caching**: Cache OAuth bearer tokens until expiry to reduce token requests
3. **Data Transformation**: Map MDM response to existing prohibited items format
4. **Fallback**: Implement fallback to local JSON files if API unavailable
5. **Environment-specific URLs**: Configure per-environment values in appConfig files (dev1, tst1, snd4, pre1, prd1)

### Test Coverage

- ✅ 12 unit tests covering all scenarios
- ✅ Success on first attempt
- ✅ Success after retries with logging
- ✅ HTTP error handling (401, 404, 500)
- ✅ Network error retry logic
- ✅ Maximum retry limit
- ✅ Custom retry parameters
- ✅ Configuration tests

All tests passing with full coverage of the MDM service logic.

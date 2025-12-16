# MDM Countries Integration

## Overview

This document describes the integration of the MDM `/geo/countries` endpoint for dynamic ISO code validation, replacing the static `data-iso-codes.json` file with MDM API data in production environments.

## Architecture

The integration follows the same pattern as the existing ineligible items feature:

1. **iso-codes-service.js** - Routes between local file and MDM API based on configuration
2. **mdm-service.js** - Handles MDM API calls with OAuth authentication and retry logic
3. **mdm-blob-cache-service.js** - Caches MDM responses in Azure Blob Storage with TTL-based expiration
4. **packing-list-validator-utilities.js** - Validates ISO codes using dynamically loaded data

### Three-Tier Fallback Strategy

1. **Fresh Cache**: Returns cached data if within TTL (default: 3600 seconds)
2. **MDM API**: Fetches from `/geo/countries` endpoint with OAuth 2.0 authentication
3. **Stale Cache**: Falls back to expired cache if API unavailable

## Files Modified

### New Files

- **app/services/iso-codes-service.js** - Service layer for ISO codes data retrieval
- **test/unit/services/iso-codes-service.test.js** - Unit tests (19 test cases, all passing)

### Modified Files

- **app/services/mdm-service.js**
  - Added `GET_COUNTRIES_METHOD` constant
  - Added `getCountries()` method with same resilience pattern as `getNirmsIneligibleItems()`
  - Updated exports to include `getCountries`

- **app/services/cache/mdm-blob-cache-service.js**
  - Updated to support multiple cache keys (was hardcoded to "nirms-ineligible-items.json")
  - Added `getBlobName()` function to map data types to blob names
  - Modified `get()`, `getStale()`, `set()`, `getFromBlob()`, `getStaleFromBlob()`, `setToBlob()` to accept optional `dataType` parameter
  - Maintains backward compatibility with default parameter values

- **app/services/validators/packing-list-validator-utilities.js**
  - Replaced static `require()` of data-iso-codes.json with dynamic loading
  - Added `isoCodesData` module-level cache variable
  - Added `initializeIsoCodes()` async function with multi-level fallback
  - Auto-initializes on module load
  - Updated exports to include `initializeIsoCodes`

## Environment Variables

### New Variables

- **MDM_ISO_CODES_FILE** (optional): Path to local ISO codes file
  - Default: `./data/data-iso-codes.json`
  - Used when `MDM_USE_LOCAL_DATA=true`

### Existing Variables

- **MDM_USE_LOCAL_DATA**: Toggle between local file and MDM API
  - `true` = Use local file (development/testing)
  - `false` = Use MDM API (production)

## MDM API Details

### Endpoint

```
GET /geo/countries
```

### Authentication

- OAuth 2.0 client credentials flow
- APIM subscription key header: `Ocp-Apim-Subscription-Key`

### Response Format

The service supports multiple response structures:

```javascript
// Option 1: countries at root
{
  "countries": [
    { "isoCode": "GB", "name": "United Kingdom" },
    { "isoCode": "US", "name": "United States" }
  ]
}

// Option 2: Nested structure
{
  "data": {
    "countries": [...]
  }
}

// Option 3: Array at data property
{
  "data": [...]
}

// Option 4: Direct array
[...]
```

The service extracts ISO codes from these property names (in order of preference):

1. `isoCode`
2. `code`
3. `iso2`

## Cache Storage

### Blob Names

- Ineligible items: `nirms-ineligible-items.json`
- Countries: `countries.json`

### Storage Location

- **Development**: Azurite emulator (`devstoreaccount1` container)
- **Production**: Azure Blob Storage (`MDM_CACHE_CONTAINER_NAME`)

### Cache Metadata

Each cached blob includes metadata:

```json
{
  "cachedAt": "2024-12-16T12:00:00.000Z",
  "ttl": "3600",
  "source": "mdm-api"
}
```

## Testing

### Unit Tests

**test/unit/services/iso-codes-service.test.js**: 19 tests, all passing

- Local mode tests (MDM_USE_LOCAL_DATA=true)
- MDM mode tests (MDM_USE_LOCAL_DATA=false)
- Various response format handling
- Error handling and fallback scenarios
- Edge cases (malformed responses, null/undefined values)

### Test Coverage

```
Statements   : 92.01% ( 3628/3943 )
Branches     : 85.02% ( 914/1075 )
Functions    : 92.23% ( 487/528 )
Lines        : 92% ( 3604/3917 )
Test Suites: 156 passed
Tests:       1298 passed
```

## Usage Examples

### Local Development Mode

```bash
# Set environment variable
export MDM_USE_LOCAL_DATA=true

# ISO codes will be loaded from ./data/data-iso-codes.json
```

### Production Mode

```bash
# Set environment variable
export MDM_USE_LOCAL_DATA=false

# ISO codes will be fetched from MDM API with caching
```

### Custom Local File Path

```bash
export MDM_USE_LOCAL_DATA=true
export MDM_ISO_CODES_FILE=/custom/path/to/iso-codes.json
```

## Error Handling

### Local Mode

- Throws error if local file cannot be loaded
- No fallback to MDM API (fail-fast for development issues)

### MDM Mode

- Retries on network failures (configurable via `mdmConfig.maxRetries`)
- No retries on HTTP errors (immediate stale cache fallback)
- Logs all errors with context for troubleshooting
- Final fallback to stale cache if all retries exhausted

### Validator Initialization

```javascript
// Multi-level fallback chain:
// 1. iso-codes-service.getIsoCodes() (respects MDM_USE_LOCAL_DATA)
// 2. Local file (./data/data-iso-codes.json)
// 3. Empty array (validation will fail, but service remains operational)
```

## Migration Notes

### No Breaking Changes

- Existing functionality remains unchanged
- Default behavior uses local file in development
- Production deployments need `MDM_USE_LOCAL_DATA=false` to enable MDM integration

### Deployment Checklist

1. ✅ Update environment variables:
   - Set `MDM_USE_LOCAL_DATA=false` in production environments
   - Verify MDM credentials (client ID, secret, subscription key)
   - Verify Azure Blob Storage configuration

2. ✅ Verify cache container exists:
   - Container name from `MDM_CACHE_CONTAINER_NAME` environment variable
   - Ensure service principal has read/write permissions

3. ✅ Test MDM endpoint connectivity:
   - Use `apimRequest.py` script to verify `/geo/countries` endpoint
   - Verify OAuth token acquisition
   - Verify response format matches expectations

4. ✅ Monitor initial deployment:
   - Check logs for MDM API calls
   - Verify cache population
   - Monitor fallback to stale cache scenarios

## Troubleshooting

### ISO Code Validation Failing

1. Check `MDM_USE_LOCAL_DATA` setting
2. Verify local file exists if using local mode
3. Check MDM API connectivity if using MDM mode
4. Review logs for cache retrieval errors

### Cache Not Populating

1. Verify Azure Blob Storage credentials
2. Check container exists and is accessible
3. Review logs for cache write errors
4. Verify service principal permissions

### MDM API Errors

1. Verify OAuth credentials (client ID, secret)
2. Check APIM subscription key
3. Verify endpoint URL configuration
4. Review MDM API status and availability

## Related Documentation

- **MDM-INTEGRATION.md**: General MDM integration documentation
- **LOCAL-TESTING-MDM-CACHE.md**: Local testing with Azurite
- **apimRequest.py**: Script for testing MDM endpoints

## Future Enhancements

- [ ] Add cache warming endpoint for manual cache refresh
- [ ] Add metrics/monitoring for cache hit rates
- [ ] Add support for cache versioning
- [ ] Consider adding cache pre-warming on service startup
- [ ] Add health check endpoint for MDM connectivity

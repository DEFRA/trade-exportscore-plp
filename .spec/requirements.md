# DEFRA Trade Export Core - Packing List Parser (PLP) Service Requirements

## Introduction

The Packing List Parser (PLP) Service is a critical component of DEFRA's trade exports system that processes packing lists from multiple retailers to extract structured trade data for regulatory compliance and export documentation. The service handles 33 different retailer variants across multiple document formats, implementing sophisticated pattern matching and data validation to ensure accurate trade data extraction.

## Requirements

### Requirement 1: Multi-Format Document Processing

**User Story:** As a DEFRA trade compliance officer, I want the system to process both Excel and PDF packing lists from different retailers so that I can obtain standardized trade data regardless of the source format.

#### Acceptance Criteria

1. When an Excel (.xlsx) file is uploaded, then the system should convert it to JSON and process using retailer-specific parsers for 27 supported variants
2. When a PDF file from Iceland, M&S, or Greggs is uploaded, then the system should process it using Azure Document Intelligence AI models
3. When a PDF file from Booker or Giovanni is uploaded, then the system should process it using coordinate-based extraction methods
4. If an unsupported format is provided, then the system should return a "NOMATCH" response without throwing errors

### Requirement 2: Retailer Identification and Parsing

**User Story:** As a system administrator, I want the service to automatically identify the retailer format and apply appropriate parsing logic so that data extraction is accurate and consistent.

#### Acceptance Criteria

1. When a document is processed, then the system should identify the retailer using establishment number patterns (RMS-GB-XXXXXX-XXX format)
2. When establishment numbers are found, then the system should match against header patterns to select the correct parser variant
3. When multiple parser variants exist for a retailer (e.g., ASDA1, ASDA2, ASDA3), then the system should select the most appropriate one based on header matching
4. If no matching parser is found, then the system should return parserModel "NOMATCH" and continue processing gracefully

### Requirement 3: Data Standardization and Validation

**User Story:** As a trade data analyst, I want all extracted data to follow a consistent schema with validated fields so that downstream systems can process the information reliably.

#### Acceptance Criteria

1. When data is extracted, then the system should map it to standard fields: description, commodity_code, number_of_packages, total_net_weight_kg, country_of_origin, row_location
2. When commodity codes are present, then they should be validated against the 10-digit format requirement
3. When establishment numbers are extracted, then they should match the exact pattern RMS-GB-XXXXXX-XXX
4. If required fields are missing or invalid, then the system should set allRequiredFieldsPresent to false and populate reasonsForFailure array
5. When validation passes, then the system should set allRequiredFieldsPresent to true

### Requirement 4: Azure Cloud Integration

**User Story:** As a cloud infrastructure manager, I want the service to leverage Azure services for scalability, AI processing, and secure communication so that the system meets enterprise standards.

#### Acceptance Criteria

1. When PDF AI processing is required, then the system should connect to Azure Document Intelligence using DefaultAzureCredential
2. When messages need to be sent, then the system should publish to Azure Service Bus PLP topic/subscription
3. When authentication is required, then the system should use Azure AD OAuth2 with client credentials flow
4. If Azure services are unavailable, then the system should return appropriate HTTP 503 responses and log errors

### Requirement 5: Database Operations and Persistence

**User Story:** As a data administrator, I want processed packing list data to be stored in PostgreSQL with proper relationships so that historical data can be tracked and queried efficiently.

#### Acceptance Criteria

1. When processing is successful, then the system should create PackingList records with applicationId, registrationApprovalNumber, parserModel, and other metadata
2. When items are extracted, then the system should create Item records linked to the PackingList via applicationId foreign key
3. When database operations fail, then the system should log errors and continue processing without data persistence
4. When multiple items exist, then all should be stored as separate Item records with proper UUID itemId generation

### Requirement 6: RESTful API Endpoints

**User Story:** As an API consumer, I want well-defined REST endpoints for different processing types so that I can integrate the service into various workflows.

#### Acceptance Criteria

1. When GET /non-ai is called with filename parameter, then the system should process Excel files and return standardized JSON response
2. When GET /ai is called with filename parameter, then the system should process PDF files using Azure AI and return standardized JSON response
3. When GET /pdf-non-ai is called with filename parameter, then the system should process PDF files using coordinate extraction and return standardized JSON response
4. When GET /healthy or /healthz is called, then the system should return HTTP 200 with "OK" status
5. When GET /test-di-conn is called, then the system should test Azure Document Intelligence connectivity and return results
6. When invalid parameters are provided, then the system should return HTTP 400 with descriptive error messages

### Requirement 7: Error Handling and Monitoring

**User Story:** As a system operator, I want comprehensive error handling and monitoring so that I can quickly identify and resolve issues in production.

#### Acceptance Criteria

1. When any error occurs, then the system should log it with appropriate severity level and contextual information
2. When processing fails, then the system should return graceful error responses instead of system crashes
3. When health checks are performed, then the system should verify database connectivity and Azure service availability
4. If critical services are down, then health checks should return HTTP 503 and trigger monitoring alerts
5. When errors are logged, then they should include filename, function name, and full error details for debugging

### Requirement 8: Performance and Scalability

**User Story:** As a performance engineer, I want the system to process documents efficiently with predictable response times so that it can handle production load requirements.

#### Acceptance Criteria

1. When Excel files are processed, then response times should be under 2 seconds for files up to 10MB
2. When PDF AI processing is performed, then the system should handle Azure Document Intelligence response times appropriately
3. When concurrent requests are made, then the system should process them without blocking or resource contention
4. If processing takes longer than expected, then appropriate timeout handling should prevent hung requests
5. When system resources are constrained, then graceful degradation should occur without service failure

### Requirement 9: Security and Authentication

**User Story:** As a security administrator, I want proper authentication and data protection measures so that sensitive trade data is protected according to government standards.

#### Acceptance Criteria

1. When API requests are made, then they should be authenticated using Azure AD OAuth2 tokens
2. When sensitive data is processed, then it should be handled according to data protection regulations
3. When audit trails are required, then all processing activities should be logged with user context
4. If unauthorized access is attempted, then the system should return HTTP 401/403 responses and log security events
5. When credentials are managed, then they should use Azure Key Vault or DefaultAzureCredential patterns

### Requirement 10: Development and Testing Standards

**User Story:** As a software developer, I want comprehensive testing and development standards so that code quality is maintained and deployments are reliable.

#### Acceptance Criteria

1. When code is written, then it should have corresponding Jest unit tests with minimum 80% coverage
2. When parsers are implemented, then they should include test data files and expected result validation
3. When Docker containers are built, then they should use multi-stage builds for optimization
4. If CI/CD pipelines run, then all tests must pass before deployment to any environment
5. When specifications change, then corresponding code updates should follow specification-driven development practices

## Non-Functional Requirements

### Performance

- Excel processing: < 2 seconds response time for files up to 10MB
- PDF AI processing: Handle Azure Document Intelligence latency appropriately
- Concurrent request handling: Support multiple simultaneous requests
- Memory usage: Efficient processing without memory leaks

### Reliability

- 99.9% uptime target for production environments
- Graceful degradation when dependent services are unavailable
- Comprehensive error logging and monitoring
- Automated health checks and rollback capabilities

### Security

- Azure AD OAuth2 authentication for all API endpoints
- Secure credential management using Azure services
- Data protection compliance for sensitive trade information
- Audit logging for all processing activities

### Scalability

- Horizontal scaling capability through containerization
- Stateless service design for load balancing
- Efficient database operations to handle growing data volumes
- Cloud-native architecture leveraging Azure services

## Constraints and Dependencies

### Technical Constraints

- Node.js/Hapi.js framework requirement
- PostgreSQL database with Sequelize ORM
- Azure cloud services integration mandatory
- Docker containerization for deployment

### External Dependencies

- Azure Document Intelligence for PDF AI processing
- Azure Service Bus for message queuing
- Azure Active Directory for authentication
- DEFRA regulatory compliance requirements

### Business Constraints

- Support for exactly 33 retailer variants as specified
- Establishment number format must match RMS-GB-XXXXXX-XXX pattern
- Processing must handle legacy document formats from existing retailers
- Compliance with DEFRA trade export regulations

## Success Criteria

The PLP Service requirements will be considered successfully implemented when:

1. All 33 retailer variants can be processed correctly with appropriate parser identification
2. Excel, PDF AI, and PDF coordinate-based processing all function as specified
3. Data extraction produces consistent, validated output schema across all formats
4. Azure service integration provides reliable AI processing and messaging capabilities
5. Database operations maintain data integrity with proper relationships
6. API endpoints provide consistent, well-documented REST interfaces
7. Error handling prevents service failures and provides actionable debugging information
8. Performance meets specified response time and throughput requirements
9. Security measures protect sensitive trade data according to government standards
10. Development practices enable maintainable, testable, and deployable code

> 💡 **Implementation Note**: These requirements form the foundation for the architectural design phase, which will detail the technical implementation approach for each requirement.

FROM {{adpSharedAcrName}}.azurecr.io/image/adp-postgres-migration:1.0.0

COPY --chown=liquibase:liquibase --chmod=755 changelog ./changelog

CMD ["-Command","update", "-ChangeLogFile","/changelog/db.changelog.xml"]
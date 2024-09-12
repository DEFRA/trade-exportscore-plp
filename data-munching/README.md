# How to use data munching

## Start here
You'll need a dump of the data in the applicationID-per-dir structure plus a dump of the application IDs+RMS IDs from CRM.

## 1-distill-and-copy-gcs-only
This builds up a list of dirs from the mega dump and matches against application IDs from CRM. It then takes this array and copies the data to a separate dir. This makes a dir full of just GC-related data to cut down the amount of parsing needed.

## 2
Updated applicationID lookup to include RMS numbers.
# Branching Strategy and Linking to ADO Work Item

**Please Note:** This is a proposal document at the current time

## Branch Naming

Elsewhere, there are documents on suggested naming (including in the DEFRA Development Standards). The idea of this document is to collate the standards into a simple, easy to read guide.

The suggested format is as follows:

```text
features/{ADO-ticket-number}-{description}-{developer-initials}
```

The above would, for this branch, equate to:

```text
features/421749-nisa-parser-2-jb
```

Why the above? Well, firstly it follows the DEFRA Development Standards (please note, this statement does not mean that all projects / branches follow the standard...). With the inclusion of the ADO ticket number, linking back to the original User Story / bug / etc. is a simple process of copying the number and searching within ADO. It also extends the naming convention to make identifying which developer _owns_ the branch a simple case of checking the initials.

## Linking the branch to ADO

ADO has a simple process (once you know it at least) for linking a GitHub branch to the relevant User Story, bug, etc. Below are screenshots to help guide through the process.

- Open the relevant Work Item (User story etc.). A screen similar to the below should be displayed:

![ADO Development Section](./readme-images/Screenshot%202024-08-01%20131418.png "ADO Development Section")

- The _Development_ section has been highlighted. Within the highlighted section, click on the `branch` link to display a screen similar to the following:

![GitHub Repository and Branch Screen](./readme-images/Screenshot%202024-08-01%20131931.png "GitHub Repository and Branch Screen")

- The above screen should load with the correct repository selected automatically (it can be slow, so please give it a few seconds). If it does not load / loads with incorrect selections, please use the dropdown boxes to amend until it does match the above example.
- The last mandatory step is to use the `branch` dropdown box to select the applicable branch:

![GitHub Branch Search](./readme-images/Screenshot%202024-08-01%20132236.png "GitHub Branch Search")

- In the above, the search box is highlighted. The search is fully fuzzy and any text from within the branch name can be used. Please be patient, the search can take a few seconds to populate the list.

![GitHub Branch Search - Results](./readme-images/Screenshot%202024-08-01%20132324.png "GitHub Branch Search - Results")

- In the above, the search is for the branch suffix (`-jb`), with 3 results. Simply click on the required branch to complete the selection process. Once done, the `Add link` button will be enabled:

![GitHub Branch Search - Add Link](./readme-images/Screenshot%202024-08-01%20132749.png "GitHub Branch Search - Add Link")

- Clicking the `Add link` will return you to the original work item screen, this time, with the branch linked as shown in the highlighted box (#1) below:

![GitHub Branch - Work Item](./readme-images/Screenshot%202024-08-01%20132852.png "GitHub Branch - Work Item")

- The final step is to save / save and close the work item. The choice can be made from the dropdown shown in box #2 in the above example. I tend to use _Save & Close_ by default but the dropdown can be used to change the save type.

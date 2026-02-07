# Jira CSV Import Guide – Shop Admin Onboarding

## File

- **CSV file:** `jira_import_shop_admin_onboarding.csv`
- **Contents:** 1 Epic, 20 Stories, 31 Sub-tasks (2 per story for most)

## Required columns (for import tools that need IDs)

The CSV includes **Work Item ID**, **Parent ID**, and **Work Type** so hierarchy is unambiguous:

| Column        | Purpose |
|---------------|--------|
| **Work Item ID** | Unique number per row (1 = Epic, 2–21 = Stories, 22–52 = Sub-tasks). |
| **Parent ID**    | Links to parent: empty for Epic; `1` for all Stories (Epic); `2`–`21` for Sub-tasks (parent Story ID). |
| **Work Type**    | Issue type: `Epic`, `Story`, or `Sub-task`. |

## How to Import in Jira

### 1. Prepare your Jira project

- Ensure the project has **Epic**, **Story**, and **Sub-task** issue types (or equivalent).
- If your project uses **“Subtask”** (no hyphen), after import you may need to change type, or do a find-replace in the CSV: `Sub-task` → `Subtask` before importing.
- If you use **“Epic Link”** instead of **“Epic Name”**, in the import mapping step map the **Epic Name** column to **Epic Link** and use the same values (they are the Epic’s name/summary).

### 2. Start CSV import

- **Jira Cloud:** Project → **Project settings** → **Import** (or **System** → **Import** from your Jira admin), then choose **CSV**.
- **Jira Server/Data Center:** **Settings** → **System** → **Import & Export** → **External System Import** → **CSV**.

### 3. Upload and map columns

Upload `jira_import_shop_admin_onboarding.csv` and map columns as follows:

| CSV Column    | Map to Jira Field | Notes |
|---------------|-------------------|--------|
| Summary        | Summary           | Required. |
| Description    | Description       | Optional. |
| **Work Item ID** | (Importer’s ID field) | Required. Unique per row (1–52). |
| **Parent ID**    | Parent             | Empty for Epic; `1` for Stories; `2`–`21` for Sub-tasks. |
| **Work Type**    | Issue Type         | Required. Values: Epic, Story, Sub-task. |
| Epic Name     | Epic Link / Epic Name | Link Stories to the Epic. Leave empty for Epic and Sub-tasks. |
| Labels        | Labels            | Optional. Multiple labels in one cell (e.g. space or comma separated). |
| Story Points  | Story Points      | Optional. Used for Stories. Your field name may differ (e.g. “Points”). |
| Priority      | Priority          | Optional. Values: Medium (or your equivalent). |

- **Order of rows:** Epic (ID 1) first, then Stories (IDs 2–21), then Sub-tasks (IDs 22–52). The importer uses **Work Item ID** and **Parent ID** to build the hierarchy.
- If your instance has no **Story Points** or **Epic Name**, leave those columns unmapped.

### 4. Parent linking (ID-based)

- Sub-tasks link to Stories via **Parent ID** (e.g. Parent ID `2` = first Story). The importer uses **Work Item ID** as the unique identifier so **Parent ID** references the correct parent. No need to match by Summary.

### 5. After import

- Check that the Epic exists and all Stories are linked to it (e.g. **Epic Link** or **Epic Name**).
- Check that each Sub-task has its **Parent** (via Parent ID) set to the correct Story.
- Adjust **Story Points** or **Priority** if your project uses different scales or names.

## CSV structure summary

| Work Type | Count | Work Item ID | Parent ID |
|-----------|--------|--------------|------------|
| Epic      | 1     | 1            | (empty)    |
| Story     | 20    | 2–21         | 1          |
| Sub-task  | 31    | 22–52        | 2–21 (Story ID) |

## Troubleshooting

- **“Epic Name” not found:** Map the column to **Epic Link** and ensure the Epic is created first (first row). If your Jira uses “Epic” as a custom field, map to that.
- **Sub-tasks not linking:** Ensure **Work Item ID** and **Parent ID** are mapped. Parent ID must be the Work Item ID of the parent (1 for Epic; 2–21 for Stories as parent of Sub-tasks).
- **Wrong issue types:** Edit the CSV and change `Epic`, `Story`, or `Sub-task` to match your project’s issue type names (e.g. `Subtask`).
- **Encoding:** Save the CSV as **UTF-8** if you see broken characters after import.

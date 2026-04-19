**Added: `PUT /v2/projects/{project_id}/keyword/user-trigger`**
* **Summary:** Rewrite Article User Trigger
* **Expected Success:** `200 OK` (Returns currentStatus: PROCESSING and dynamodbInserted: true)
* **Error Cases (Verified in dev):**
  * `400 Bad Request`: Missing subKeywordId OR rewrite_user_trigger_generation_count is 0

## 🚀 Release Summary
This PR was auto-generated from the `dev` branch. It contains all code ready for the production environment.

## 📝 Endpoint Details (Auto-Parsed from Swagger)
---

## ✅ Tech Lead Sign-Off
- [ ] Automated tests in `dev` have passed.
- [ ] All 400/500 error cases were verified in the `dev` environment.
- [ ] Ready to trigger Fargate deployment.
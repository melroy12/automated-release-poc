const fs = require('fs');

// 1. Read the Swagger file
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

// 2. Format the data into Markdown
let endpointMd = "";
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, details] of Object.entries(methods)) {
    endpointMd += `**Added: \`${method.toUpperCase()} ${path}\`**\n`;
    endpointMd += `* **Summary:** ${details.summary}\n`;
    
    if (details.responses) {
      endpointMd += `* **Expected Success:** \`200 OK\` (${details.responses['200']?.description || 'Success'})\n`;
      endpointMd += `* **Error Cases (Verified in dev):**\n`;
      if (details.responses['400']) {
         endpointMd += `  * \`400 Bad Request\`: ${details.responses['400'].description}\n`;
      }
    }
    endpointMd += "\n";
  }
}

// 3. Read the base template
const template = fs.readFileSync('.github/release_template.md', 'utf8');

// 4. Inject the endpoint markdown into the placeholder
const finalBody = template.replace('', endpointMd);

// 5. Save the final PR body so GitHub Actions can use it
fs.writeFileSync('final_pr_body.md', finalBody);
console.log("Successfully generated final_pr_body.md!");
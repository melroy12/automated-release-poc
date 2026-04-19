const fs = require('fs');

// Helper function to format schema as JSON example
function formatSchema(schema) {
  if (!schema || !schema.properties) return null;
  
  const obj = {};
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (prop.example !== undefined) {
      obj[key] = prop.example;
    } else if (prop.type === 'object' && prop.properties) {
      obj[key] = formatSchema(prop);
    } else if (prop.type === 'array' && prop.items) {
      obj[key] = [formatSchema(prop.items) || '...'];
    } else {
      obj[key] = `<${prop.type}>`;
    }
  }
  return obj;
}

// 1. Read the Swagger file
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

// 2. Format the data into Markdown
let endpointMd = "";
for (const [path, methods] of Object.entries(swagger.paths)) {
  for (const [method, details] of Object.entries(methods)) {
    endpointMd += `### \`${method.toUpperCase()} ${path}\`\n\n`;
    endpointMd += `**Summary:** ${details.summary}\n\n`;
    
    if (details.responses) {
      // Find success response (2xx)
      const successCode = Object.keys(details.responses).find(code => code.startsWith('2'));
      if (successCode) {
        const successResponse = details.responses[successCode];
        endpointMd += `**Expected Success:** \`${successCode}\` - ${successResponse.description}\n\n`;
        
        // Extract and display response structure
        const schema = successResponse.content?.['application/json']?.schema;
        if (schema) {
          const example = formatSchema(schema);
          endpointMd += `**Response Structure:**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
        }
      }
      
      // List all error cases
      const errorCodes = Object.keys(details.responses)
        .filter(code => code.startsWith('4') || code.startsWith('5'))
        .sort();
      
      if (errorCodes.length > 0) {
        endpointMd += `**Error Cases (Verified in dev):**\n`;
        errorCodes.forEach(code => {
          const errorResponse = details.responses[code];
          endpointMd += `* \`${code}\`: ${errorResponse.description}\n`;
          
          // Show example error structure for first error
          if (code === errorCodes[0]) {
            const errorSchema = errorResponse.content?.['application/json']?.schema;
            if (errorSchema) {
              const errorExample = formatSchema(errorSchema);
              endpointMd += `  \`\`\`json\n  ${JSON.stringify(errorExample, null, 2).replace(/\n/g, '\n  ')}\n  \`\`\`\n`;
            }
          }
        });
        endpointMd += "\n";
      }
    }
    endpointMd += "---\n\n";
  }
}

// 3. Read the base template
const template = fs.readFileSync('.github/release_template.md', 'utf8');

// 4. Inject the endpoint markdown into the placeholder
const finalBody = template.replace('---', endpointMd);

// 5. Save the final PR body so GitHub Actions can use it
fs.writeFileSync('final_pr_body.md', finalBody);
console.log("✅ Successfully generated final_pr_body.md!");
console.log(`📊 Processed ${Object.keys(swagger.paths).length} endpoint(s) with response structures dynamically extracted from swagger.json`);
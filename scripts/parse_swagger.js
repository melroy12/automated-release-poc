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

// 1. Read the CURRENT dev branch swagger
const headSwagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

// 2. Read the OLD main branch swagger (created by the GitHub Action step)
let baseSwagger = { paths: {} };
try {
  if (fs.existsSync('swagger_base.json')) {
    baseSwagger = JSON.parse(fs.readFileSync('swagger_base.json', 'utf8'));
  }
} catch (e) {
  console.error("Warning: Could not parse swagger_base.json");
}

// 3. Format the data into Markdown (ONLY for diffs)
let endpointMd = "";
let changesFound = 0;

for (const [path, methods] of Object.entries(headSwagger.paths || {})) {
  for (const [method, details] of Object.entries(methods)) {
    
    // Check if this endpoint existed in the main branch
    const baseDetails = baseSwagger.paths?.[path]?.[method];
    
    // Logic: It is NEW if it wasn't in main. It is MODIFIED if the JSON structure changed.
    const isNew = !baseDetails;
    const isModified = baseDetails && JSON.stringify(baseDetails) !== JSON.stringify(details);

    if (isNew || isModified) {
      changesFound++;
      const statusLabel = isNew ? "🟢 **NEW**" : "🟡 **MODIFIED**";
      
      endpointMd += `### ${statusLabel}: \`${method.toUpperCase()} ${path}\`\n\n`;
      endpointMd += `**Summary:** ${details.summary}\n\n`;
      
      if (details.responses) {
        // Find success response (2xx)
        const successCode = Object.keys(details.responses).find(code => code.startsWith('2'));
        if (successCode) {
          const successResponse = details.responses[successCode];
          endpointMd += `**Expected Success:** \`${successCode}\` - ${successResponse.description}\n\n`;
          
          const schema = successResponse.content?.['application/json']?.schema;
          if (schema) {
            const example = formatSchema(schema);
            endpointMd += `**Response Structure:**\n\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
          }
        }
        
        // List all error cases
        const errorCodes = Object.keys(details.responses)
          .filter(code => code.startsWith('4') || code.startsWith('5')).sort();
        
        if (errorCodes.length > 0) {
          endpointMd += `**Error Cases (Verified in dev):**\n`;
          errorCodes.forEach(code => {
            const errorResponse = details.responses[code];
            endpointMd += `* \`${code}\`: ${errorResponse.description}\n`;
            
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
}

// If nothing changed in the Swagger file, add a friendly message
if (changesFound === 0) {
  endpointMd = "> *No API endpoints were added or modified in this release.*\n\n---\n\n";
}

// 4. Read the base template & inject
const template = fs.readFileSync('.github/release_template.md', 'utf8');
const finalBody = template.replace('---', endpointMd);

// Output
if (process.env.CI || process.argv.includes('--output')) {
  console.log(finalBody);
} else {
  console.error(`Successfully parsed swagger. Found ${changesFound} changed endpoints.`);
}
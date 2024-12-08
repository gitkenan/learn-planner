export async function generatePlan(topic: string): Promise<string[]> {
  const prompt = `Create a concise learning plan for the topic: ${topic}`;
  
  const response = await fetch("https://nvidia-api-endpoint/ibm-granite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NVIDIA_API_KEY!}`
    },
    body: JSON.stringify({ 
      prompt, 
      model: "IBM_Granite_3_0_8B_Instruct",
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.plan || [];
}

export async function expandDetail(point: string): Promise<string> {
  const prompt = `Expand the following learning point with detailed explanation: ${point}`;
  
  const response = await fetch("https://nvidia-api-endpoint/ibm-granite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NVIDIA_API_KEY!}`
    },
    body: JSON.stringify({ 
      prompt, 
      model: "IBM_Granite_3_0_8B_Instruct",
      max_tokens: 1500,
      temperature: 0.7
    })
  });

  const data = await response.json();
  return data.expandedDetail || "No expansion available.";
}

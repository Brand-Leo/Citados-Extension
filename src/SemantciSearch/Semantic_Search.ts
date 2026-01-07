const API_KEY = process.env.SS_API_KEY;      // opcional
const BASE= 'https://api.semanticscholar.org/graph/v1'; 


interface Paper {
  paperId: string;
  title: string;
  year?: number;
  abstract?: string;
  authors?: { name: string }[];
  openAccessPdf?: { url: string };
}

async function buscarSemanticScholar(query: string, limit: number = 5): Promise<Paper[]> 
{
  const fields = 'title,abstract,year,authors,openAccessPdf';
  const url    = `${BASE}/paper/search?query=${encodeURIComponent(query)}&fields=${fields}&limit=${limit}`;

  const headers: Record<string, string> = {};
  if (API_KEY) { headers['x-api-key'] = API_KEY; } // mejor rendimiento

  const res  = await fetch(url, { headers });
  if (!res.ok) { throw new Error(`Error ${res.status}: ${res.statusText}`);
  
}  
    const data = await res.json() as any;
    return data.data as Paper[];
}

// uso
export async function main (query: string, limit: number) {
  try {
    const papers = await buscarSemanticScholar(query, limit);

    console.log('Imprimiendo todos los enlaces encontrados');
    papers.forEach(p => {
      console.log(`📄 ${p.title} (${p.year})`);
      console.log(`👥 ${p.authors?.map(a => a.name).join(', ')}`);
      console.log(`🔗 PDF: ${p.openAccessPdf?.url || 'No open access'}\n`);
    });

  } catch (err) {
    console.log('Ocurrio el error:');
    console.error(err);
  }
};
export function generateBuilderTitle(name: string, stack: string, role: string): string {
  const s = stack.toLowerCase().trim();
  const r = role.toLowerCase().trim();

  // Mappings for Stack
  if (s.includes('ai') || s.includes('ml') || s.includes('learning') || s.includes('llm')) {
    if (r.includes('architect')) return 'AI Architect';
    if (r.includes('design')) return 'Cognitive Designer';
    if (r.includes('wizard') || r.includes('magic')) return 'Prompt Sorcerer';
    return 'Machine Learning Tinkerer';
  }

  if (s.includes('react') || s.includes('frontend') || s.includes('next') || s.includes('vue') || s.includes('css')) {
    if (r.includes('wizard') || r.includes('magic')) return 'CSS Wizard';
    if (r.includes('architect')) return 'UI/UX Architect';
    if (r.includes('manager') || r.includes('lead')) return 'Pixel Commander';
    return 'Frontend Alchemist';
  }

  if (s.includes('node') || s.includes('backend') || s.includes('api') || s.includes('database') || s.includes('sql') || s.includes('go') || s.includes('rust')) {
    if (r.includes('wizard') || r.includes('magic')) return 'Database Sorcerer';
    if (r.includes('architect')) return 'Cloud Architect';
    return 'API Architect';
  }

  if (s.includes('devops') || s.includes('infra') || s.includes('kubernetes') || s.includes('aws') || s.includes('cloud')) {
    return 'Infrastructure Wizard';
  }

  if (s.includes('mobile') || s.includes('flutter') || s.includes('react native') || s.includes('ios') || s.includes('android')) {
    return 'Mobile Experience Builder';
  }

  if (s.includes('web3') || s.includes('solidity') || s.includes('blockchain') || s.includes('crypto')) {
    return 'Smart Contract Hacker';
  }

  if (s.includes('design') || s.includes('figma') || s.includes('ui') || s.includes('ux')) {
    return 'Creative Alchemist';
  }

  // Fallbacks based on role/stack keyword overlaps
  if (r.includes('product') || r.includes('growth')) {
    return 'Product Hacker';
  }

  if (r.includes('data') || s.includes('data') || s.includes('python')) {
    return 'Data Explorer';
  }

  if (r.includes('hacker') || r.includes('builder')) {
    return 'Goa Hackathon Legend';
  }

  // General combinations
  const prefixes = ['Code', 'Systems', 'Byte', 'Fullstack', 'Tech', 'Cyber'];
  const suffixes = ['Shaper', 'Architect', 'Wrangler', 'Synthesizer', 'Craftsman', 'Enthusiast'];
  
  // Deterministic selector based on name length or character sum
  const charSum = (name + stack + role).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const pIndex = charSum % prefixes.length;
  const sIndex = (charSum + 3) % suffixes.length;

  return `${prefixes[pIndex]} ${suffixes[sIndex]}`;
}

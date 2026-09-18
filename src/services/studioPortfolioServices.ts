import { API_ENDPOINTS } from '../utils/urls';
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
export const fetchStudioPortfolios = () => fetch(API_ENDPOINTS.STUDIO_PORTFOLIOS.BASE, { headers: headers() });
const formData = (studioName: string, projects: any[]) => {
  const form = new FormData(); form.append('studioName', studioName); let imageIndex = 0;
  const payload = projects.map(project => { const item: any = { projectName: project.projectName, imageUrl: project.imageUrl || null }; if (project.imageFile) { item.imageIndex = imageIndex++; form.append('projectImages', project.imageFile); } return item; });
  form.append('projects', JSON.stringify(payload)); return form;
};
export const createStudioPortfolio = (studioName: string, projects: any[]) => fetch(API_ENDPOINTS.STUDIO_PORTFOLIOS.BASE, { method: 'POST', headers: headers(), body: formData(studioName, projects) });
export const updateStudioPortfolio = (id: number, studioName: string, projects: any[]) => fetch(API_ENDPOINTS.STUDIO_PORTFOLIOS.BY_ID(id), { method: 'PUT', headers: headers(), body: formData(studioName, projects) });
export const deleteStudioPortfolio = (id: number) => fetch(API_ENDPOINTS.STUDIO_PORTFOLIOS.BY_ID(id), { method: 'DELETE', headers: headers() });

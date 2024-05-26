let canRequest = true;

async function getProjectIdeaFromAPI(frontend, backend, domain, additionalInput) {
    if (!canRequest) {
        return;
    }

    try {
        const response = await fetch(`/api/generate-project-idea?frontend=${encodeURIComponent(frontend)}&backend=${encodeURIComponent(backend)}&domain=${encodeURIComponent(domain)}&additionalInput=${encodeURIComponent(additionalInput)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Escape backticks by replacing them with double quotes
        const projectIdeaString = data.projectIdea.replace(/`/g, '"');
        const projectIdea = JSON.parse(projectIdeaString); // Parse the JSON string
        return projectIdea;
    } catch (error) {
        console.error('Error fetching project idea:', error);
        return {
            title: 'Error',
            description: 'Retry once again Oni-chaan',
            technologies: [],
            hours: 0
        };
    } finally {
        canRequest = false;
        setTimeout(() => {
            canRequest = true;
        }, 30000); // Rate limit: 1 minute
    }
}

function renderProjectIdea(projectIdea) {
    const projectIdeaDiv = document.getElementById('project-idea');
    const technologies = projectIdea.technologies || [];

    projectIdeaDiv.innerHTML = `
        <h2>${projectIdea.title}</h2>
        <p>${projectIdea.description}</p>
        <h3>Technologies:</h3>
        <ul>
            ${technologies.map(tech => `<li>${tech}</li>`).join('')}
        </ul>
        <h3>Estimated Time: ${projectIdea.hours} hours</h3>
    `;
}

document.getElementById('generate-button').addEventListener('click', async () => {
    const frontend = document.getElementById('frontend-select').value;
    const backend = document.getElementById('backend-select').value;
    const domain = document.getElementById('domain-select').value;
    const additionalInput = document.getElementById('additional-input').value;
    const projectIdea = await getProjectIdeaFromAPI(frontend, backend, domain, additionalInput);
    renderProjectIdea(projectIdea);
    
    // Play the success audio
    const audio = document.getElementById('success-audio');
    audio.play();
});

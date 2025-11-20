import Card from '../../../shared/components/Card';

const ProjectShowcase = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id} hover>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-gray-600">{project.description}</p>
            <div className="flex gap-2">
              {project.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  {tag}
                </span>
              ))}
            </div>
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              View Demo →
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectShowcase;


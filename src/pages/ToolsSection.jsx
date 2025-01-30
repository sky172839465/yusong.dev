export default function ToolsSection() {
  const tools = [
    { name: 'Code Editor', description: 'A powerful code editor for all your development needs.' },
    { name: 'Version Control', description: 'Keep track of your code changes and collaborate effectively.' },
    { name: 'Task Runner', description: 'Automate your development workflow and boost productivity.' }
  ]

  return (
    <section id='tools' className='my-12'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        Essential Tools
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {tools.map((tool, index) => (
          <div key={index} className='overflow-hidden rounded-lg bg-card text-card-foreground shadow-md'>
            <div className='p-6'>
              <h3 className='mb-2 flex items-center text-lg font-semibold'>
                <span className='mr-2'>
                  🛠️
                </span>
                {tool.name}
              </h3>
              <p className='text-muted-foreground'>
                {tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


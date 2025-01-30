export default function ArticlesSection() {
  const articles = [
    {
      id: 1,
      title: 'Getting Started with React',
      description: 'Learn the basics of React and start building your first app.'
    },
    {
      id: 2,
      title: 'Advanced CSS Techniques',
      description: 'Discover powerful CSS techniques to enhance your web designs.'
    },
    {
      id: 3,
      title: 'The Future of JavaScript',
      description: 'Explore upcoming features and trends in JavaScript development.'
    }
  ]

  return (
    <section id='articles' className='my-12'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        Latest Articles
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {articles.map((article) => (
          <div key={article.id} className='overflow-hidden rounded-lg bg-card text-card-foreground shadow-md'>
            <div className='p-6'>
              <h3 className='mb-2 text-lg font-semibold'>
                {article.title}
              </h3>
              <p className='mb-4 text-muted-foreground'>
                {article.description}
              </p>
              <a href={`/article/${article.id}`} className='text-primary hover:underline'>
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


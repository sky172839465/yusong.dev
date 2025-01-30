export default function FitnessSection() {
  const fitnessItems = [
    { title: 'Daily Workout Routines', description: 'Quick and effective workouts you can do at home.' },
    { title: 'Nutrition Tips', description: 'Learn about balanced diets to support your fitness goals.' },
    { title: 'Mind-Body Balance', description: 'Discover techniques for mental wellness alongside physical fitness.' }
  ]

  return (
    <section id='fitness' className='my-12'>
      <h2 className='mb-6 text-3xl font-bold text-foreground'>
        Fitness Corner
      </h2>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {fitnessItems.map((item, index) => (
          <div key={index} className='overflow-hidden rounded-lg bg-card text-card-foreground shadow-md'>
            <div className='p-6'>
              <h3 className='mb-2 flex items-center text-lg font-semibold'>
                <span className='mr-2'>
                  💪
                </span>
                {item.title}
              </h3>
              <p className='text-muted-foreground'>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


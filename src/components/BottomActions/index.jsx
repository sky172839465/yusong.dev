const BottomActions = (props) => {
  const { children } = props

  return (
    <>
      <div className='h-px w-full' />
      <div
        className={`
          sticky bottom-8 left-0 flex w-full justify-center transition-all
        `}
      >
        <ul
          className={`
            menu menu-horizontal menu-sm rounded-box bg-black text-white
            shadow-sm shadow-slate-500 dark:bg-slate-700  dark:opacity-90 dark:shadow-slate-600
          `}
        >
          {children}
        </ul>
      </div>
    </>
  )
}

export default BottomActions

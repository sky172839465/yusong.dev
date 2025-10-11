import * as m from 'motion/react-m'

const FadeIn = (props) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    />
  )
}

export default FadeIn

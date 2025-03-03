import * as m from 'motion/react-m'

const FadeIn = (props) => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      {...props}
    />
  )
}

export default FadeIn

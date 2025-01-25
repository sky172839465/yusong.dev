import { useClickOutside, useToggle } from '@react-hooks-library/core'
import { isEmpty, map } from 'lodash-es'
import { useRef } from 'react'
import { FaList } from 'react-icons/fa6'
import { MdTitle } from 'react-icons/md'

const Dropdown = (props) => {
  const { title, sections = [] } = props
  const sectionDropdownRef = useRef()
  const { bool: isSectionVisible, toggle, setFalse } = useToggle(false)

  const scrollToSection = (e) => {
    const target = document.querySelector(`a[href="${e.target.dataset.hash}"]`)
    if (!target) {
      return
    }

    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useClickOutside(sectionDropdownRef, setFalse)

  if (isEmpty(sections)) {
    return null
  }

  return (
    <li>
      <div
        ref={sectionDropdownRef}
        onClick={toggle}
        className={`
          dropdown dropdown-top ${isSectionVisible ? 'dropdown-open' : ''}
        `}
      >
        <FaList />
        <a role='button'>
          {title}
        </a>
        <ul
          className={`
            menu dropdown-content
            !fixed !bottom-24 left-2 m-0 w-[calc(100dvw-1rem)] rounded-box bg-black p-2
            text-white shadow md:left-[25dvw] md:w-[50dvw]
            dark:bg-slate-700 [&_a]:whitespace-nowrap
          `}
        >
          {map(sections, (section, index) => {
            return (
              <li key={index}>
                <div className='flex flex-row'>
                  <MdTitle />
                  <a
                    data-hash={section.hash}
                    onClick={scrollToSection}
                    className='block w-[82dvw] truncate md:w-[44dvw]'
                  >
                    {section.label}
                  </a>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

export default Dropdown
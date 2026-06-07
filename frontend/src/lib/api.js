import caseStudies from '../data/casestudies.json'
import blogPosts from '../data/blogposts.json'
import axios from 'axios'

export const apiClient = {
  get: async (url) => {
    // Add small artificial delay for smoother loading skeleton UX
    await new Promise((resolve) => setTimeout(resolve, 250))

    if (url === '/casestudies') {
      return { data: caseStudies }
    }

    if (url.startsWith('/casestudies/')) {
      const id = parseInt(url.split('/').pop(), 10)
      const study = caseStudies.find((c) => c.id === id)
      if (!study) {
        throw {
          response: {
            data: { detail: `Case study #${id} not found.` },
          },
        }
      }
      return { data: study }
    }

    if (url === '/blog') {
      return { data: blogPosts }
    }

    if (url.startsWith('/blog/')) {
      const id = parseInt(url.split('/').pop(), 10)
      const post = blogPosts.find((b) => b.id === id)
      if (!post) {
        throw {
          response: {
            data: { detail: `Blog post #${id} not found.` },
          },
        }
      }
      return { data: post }
    }

    throw new Error(`Static mock not implemented for GET: ${url}`)
  },

  post: async (url, data) => {
    // Add small artificial delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    if (url === '/contact') {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
      
      if (!accessKey) {
        console.warn('VITE_WEB3FORMS_ACCESS_KEY is not defined. Simulating successful form submission.')
        return {
          data: {
            id: 1,
            detail: 'Message received (simulated). To enable real mail delivery, please set VITE_WEB3FORMS_ACCESS_KEY in your environment.',
          },
        }
      }

      try {
        const response = await axios.post('https://api.web3forms.com/submit', {
          access_key: accessKey,
          name: data.name,
          email: data.email,
          subject: data.subject || 'Portfolio Contact Form',
          message: data.message,
          from_name: 'Portfolio Site Contact Form',
        })

        if (response.data.success) {
          return {
            data: {
              id: Date.now(),
              detail: 'Message received. I will follow up soon.',
            },
          }
        } else {
          throw new Error(response.data.message || 'Submission failed.')
        }
      } catch (err) {
        throw {
          response: {
            data: {
              detail: err.message || 'Failed to submit the form via Web3Forms.',
            },
          },
        }
      }
    }

    throw new Error(`Static mock not implemented for POST: ${url}`)
  },
}

export function getErrorMessage(error) {
  if (error?.code === 'ERR_CANCELED') {
    return 'Request canceled.'
  }

  return (
    error?.response?.data?.detail ??
    error?.message ??
    'Request failed. Check backend availability and try again.'
  )
}
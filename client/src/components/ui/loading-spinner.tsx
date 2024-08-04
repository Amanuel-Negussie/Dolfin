/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/f4YR4nV8eH8
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:
import { Inter } from 'next/font/google'
inter({
  subsets: ['latin'],
  display: 'swap',
})
To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
export function LoadingSpinner() {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900 h-12 w-12 dark:border-gray-600 dark:border-t-gray-50" />
      </div>
    )
  }
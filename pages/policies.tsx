import { NextPage } from 'next'
import styles from '@styles/Policy.module.css'
import { SiteHead } from '@components/site-head'
import { siteTitle } from '@components/layout'

const Page: NextPage = () => {
	return (
		<div className="max-w-4xl mx-auto px-4 lg:px-20 pt-12">
			<SiteHead title={`Policies | ${siteTitle}`} url={`${process.env.NEXT_PUBLIC_VERCEL_URL}/policies`}
				description="Listed here are the academic policies that a tutee must abide when requesting for a tutorial session from us."
			/>
			<h1 className="text-xl font-bold mb-4">Academic Honesty Policies</h1>
			<ol className={styles.policy}>
				<li>
					A tutee should not ask their tutor for help with graded assessments.
					Further clarifications to this restriction are as follows:
					<ol>
						<li>
							A tutee may ask for help in explaining the correct answers to graded assessments,
							provided that the instructor has already released both the questions and the answers.
						</li>
						<li>
							If the instructor has released only the questions (but not the answers), then the tutee
							may not ask for help in explaining the correct answers since there is a possibility that some
							students have not yet taken the assessment.
						</li>
					</ol>
				</li>
				<li>
					A tutee should not ask for any assistance in accomplishing machine projects.
					Further clarifications to this restriction are as follows:
					<ol>
						<li>
							A tutee may not ask for any assistance in debugging or writing code. Debugging
							is part of the fundamental competencies that should be developed by a computer studies student.
						</li>
						<li>
							A tutee may not ask for any assistance in clarifying project specifications,
							especially in CCDSTRU (Discrete Structures), where the goal of the machine
							project is to assess a student&apos;s competency in understanding specifications
							written using mathematical notation.
						</li>
					</ol>
				</li>
				<li>
					A tutor may point their tutees to helpful resources, such as books or online references.
					<ol>
						<li>
							However, intellectual property policies should be strictly observed. Therefore,
							sharing materials from instructors, including but not limited to slides, handouts,
							and previous exams, is not allowed without the written permission of the professor.
						</li>
						<li>
							Tutees may also refer to Reviewer Distribution Drives that are disseminated
							before exam weeks as part of a collaborative project between organizations within CCS.
						</li>
					</ol>
				</li>
			</ol>
		</div>
	)
}

export default Page

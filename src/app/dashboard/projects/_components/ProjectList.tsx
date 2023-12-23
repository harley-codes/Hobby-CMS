import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'

type Props = {
	projects: ProjectListItem[]
}

export function ProjectList(props: Props)
{
	const { projects } = props

	if (projects.length === 0)
	{
		return (
			<Accordion disabled>
				<AccordionSummary>
					<Typography variant="h6">No projects created yet...</Typography>
				</AccordionSummary>
			</Accordion>
		)
	}

	return (
		<div>
			{projects.map((project) => (
				<Accordion key={project.id}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography variant="h6">{project.name}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{/* Add details for the project */}
					</AccordionDetails>
				</Accordion>
			))}
		</div>
	)
}

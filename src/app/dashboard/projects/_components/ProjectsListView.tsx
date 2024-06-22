/**
 * ProjectList generates a list of ProjectListItemComponents
 * Only one project can be editable at a time;
 * If the accordion is closed before saving, the changes are discarded.
 * For the active project, instead of passing projects[index], we pass activeProject.
 * activeProject is used to update projects[] when the user saves changes.
 * Because only one project is updatable at a time, we don't need to reference projectId for most handlers.
 */

'use client'

import { createProjectTokenServerAction, deleteProjectTokenServerAction } from '@/app/dashboard/_actions/accessTokenActions'
import { createProjectServerAction, deleteProjectServerAction, updateProjectServerAction } from '@/app/dashboard/_actions/projectActions'
import { CreateProjectDialog } from '@/app/dashboard/projects/_components/CreateProjectDialog'
import { ProjectListItem } from '@/app/dashboard/projects/_components/ProjectListItem'
import { invokeConfirmationModal } from '@/components/ConfirmationModal'
import { invokeLoadingModal } from '@/components/LoadingModal'
import { ProjectUpdateValues } from '@/modules/database/requestTypes'
import { ProjectDetail } from '@/modules/database/responseTypes'
import { useCallback, useMemo, useState } from 'react'

export function ProjectsListView(props: { projects: ProjectDetail[] })
{
	const [projects, setProjects] = useState(props.projects)
	const [activeProject, setActiveProject] = useState<ProjectDetail | undefined>(projects[0])

	const hasActiveProjectDetailsChanged = useMemo(() =>
	{
		if (!activeProject) return false

		const originalProject = projects.find(x => x.id === activeProject.id)
		if (!originalProject) return false

		const details = (project: ProjectDetail) => JSON.stringify({
			name: project.name,
			active: project.active,
			meta: project.meta
		})

		return details(activeProject) !== details(originalProject)
	}, [activeProject, projects])

	const checkProjectIsActive = useCallback((projectId: string) => activeProject?.id === projectId, [activeProject])

	function setActiveProjectHandler(projectId: string)
	{
		if (projectId === activeProject?.id) return

		const project = projects.find(x => x.id === projectId)
		if (project) setActiveProject(project)
	}

	function updateActiveProjectHandler(values: ProjectUpdateValues)
	{
		if (!activeProject) return

		const updatedProject = { ...activeProject, ...values }
		setActiveProject(updatedProject)
	}

	async function createProjectHandler(newName: string)
	{
		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Creating Project' })

		invokeLoading(true)

		const newProject = await createProjectServerAction(newName, true)

		setProjects([newProject, ...projects])
		setActiveProject(newProject)

		invokeLoading(false)

		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	async function saveActiveProjectHandler()
	{
		if (!activeProject) return

		invokeConfirmationModal({
			description: 'Are you sure you want to save changes to this project?',
			onConfirmed: (confirmed) => confirmed && save(),
		})

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Saving Project' })

		const save = async () =>
		{
			invokeLoading(true)

			const updatedProject = await updateProjectServerAction(activeProject.id, {
				name: activeProject.name,
				active: activeProject.active,
				meta: activeProject.meta,
			})

			setProjects(projects.map(project =>
				project.id === activeProject.id
					? updatedProject
					: project
			))

			invokeLoading(false)
		}
	}

	async function deleteActiveProjectHandler()
	{
		if (!activeProject) return

		invokeConfirmationModal({
			description: 'Are you sure you want to delete this project?',
			onConfirmed: (confirmed) => confirmed && save(),
		})

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Deleting Project' })

		const save = async () =>
		{
			invokeLoading(true)

			await deleteProjectServerAction(activeProject.id)

			const updatedProjectList = projects.filter(project => project.id !== activeProject.id)

			setProjects(updatedProjectList)
			setActiveProject(updatedProjectList[0] ?? undefined)

			invokeLoading(false)
		}
	}

	async function createTokenHandler()
	{
		if (!activeProject) return

		invokeConfirmationModal({
			description: 'Are you sure you want to create new token?',
			onConfirmed: (confirmed) => confirmed && save(),
		})

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Creating Token' })

		const save = async () =>
		{
			invokeLoading(true)

			const newToken = await createProjectTokenServerAction(activeProject.id)

			const updatedProjectList = projects.map(project =>
				project.id === activeProject.id
					? { ...project, accessTokens: [...project.accessTokens, newToken] }
					: project
			)

			setProjects(updatedProjectList)
			setActiveProject(updatedProjectList.find(project => project.id === activeProject.id) ?? undefined)

			invokeLoading(false)
		}
	}

	async function deleteTokenHandler(tokenId: string)
	{
		if (!activeProject) return

		invokeConfirmationModal({
			description: 'Are you sure you want to delete this token?',
			onConfirmed: (confirmed) => confirmed && save(),
		})

		const invokeLoading = (display: boolean) => invokeLoadingModal({ display, textOverride: 'Deleting Token' })

		const save = async () =>
		{
			invokeLoading(true)

			await deleteProjectTokenServerAction(tokenId)

			const updatedProjectList = projects.map(project =>
				project.id === activeProject.id
					? { ...project, accessTokens: project.accessTokens.filter(x => x.id !== tokenId) }
					: project
			)

			setProjects(updatedProjectList)
			setActiveProject(updatedProjectList.find(project => project.id === activeProject.id) ?? undefined)

			invokeLoading(false)
		}
	}

	return (
		<div>
			{projects.map(project => (
				<ProjectListItem
					key={project.id}
					project={checkProjectIsActive(project.id) ? activeProject! : project}
					expanded={checkProjectIsActive(project.id)}
					detailsChangePending={checkProjectIsActive(project.id) && hasActiveProjectDetailsChanged}
					updateDetail={updateActiveProjectHandler}
					saveProject={saveActiveProjectHandler}
					deleteProject={deleteActiveProjectHandler}
					createToken={createTokenHandler}
					deleteToken={deleteTokenHandler}
					setActiveProject={setActiveProjectHandler}
				/>
			))}

			<CreateProjectDialog
				currentProjectNames={projects.map(x => x.name)}
				onCreateProject={createProjectHandler}
			/>
		</div>
	)
}

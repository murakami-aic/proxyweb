import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deletePost, fileUrl } from '../lib/api'
import { formatDate } from '../lib/format'

const Avatar = ({ post }) =>
	post.avatar_url ? (
		<img
			src={fileUrl(post.avatar_url)}
			alt=''
			aria-hidden='true'
			width='40'
			height='40'
			loading='lazy'
			className='w-10 h-10 aspect-square object-cover border shrink-0'
		/>
	) : (
		<span
			aria-hidden='true'
			className='w-10 h-10 aspect-square border bg-primary-200 shrink-0 inline-flex items-center justify-center font-bold select-none'
		>
			{post.name.charAt(0).toUpperCase()}
		</span>
	)

const Attachments = ({ attachments }) => {
	if (!attachments?.length) return null
	return (
		<div className='flex flex-col gap-2'>
			{attachments.filter(a => a.type === 'image').map(a => (
				<img
					key={a.url}
					src={fileUrl(a.url)}
					alt='Imagen adjunta'
					loading='lazy'
					className='border max-w-full max-h-[400px] w-auto object-contain self-start'
				/>
			))}
			{attachments.filter(a => a.type === 'audio').map(a => (
				<audio key={a.url} src={fileUrl(a.url)} controls preload='none' className='w-full max-w-md' />
			))}
		</div>
	)
}

/**
 * Tarjeta de publicación. Con `to` enlaza al hilo completo,
 * sin `to` muestra el contenido expandido.
 */
function ForoPost({ post, to, linkText, onDelete }) {
	const [showDelete, setShowDelete] = useState(false)
	const [token, setToken] = useState('')
	const [error, setError] = useState(null)

	const handleDelete = async () => {
		try {
			await deletePost(post.id, token)
			onDelete?.(post.id)
		} catch {
			setError('No se pudo borrar. Revisa el token.')
		}
	}

	const excerpt = to && post.content.length > 280
		? post.content.slice(0, 280).trimEnd() + '...'
		: post.content

	return (
		<article className='flex flex-col gap-2 border p-3 bg-white'>
			<header className='flex items-center gap-2 flex-wrap'>
				<Avatar post={post} />
				<div className='min-w-0'>
					<p className='font-semibold text-sm leading-tight break-words'>{post.name}</p>
					<time dateTime={new Date(post.created_at).toISOString()} className='text-xs text-gray-600'>
						{formatDate(post.created_at)}
					</time>
				</div>
				{post.reply_count !== undefined && (
					<span className='ml-auto text-xs bg-primary-100 border px-2 py-0.5'>
						{post.reply_count} {post.reply_count === 1 ? 'respuesta' : 'respuestas'}
					</span>
				)}
			</header>

			{to ? (
				<Link
					to={to}
					className='text-pretty whitespace-pre-wrap break-words underline focus-visible:outline-2 focus-visible:outline-primary-500'
				>
					{excerpt}
				</Link>
			) : (
				<p className='text-pretty whitespace-pre-wrap break-words'>{excerpt}</p>
			)}

			<Attachments attachments={post.attachments} />

			{to && (
				<Link
					to={to}
					className='text-sm self-start underline focus-visible:outline-2 focus-visible:outline-primary-500'
				>
					{linkText}
				</Link>
			)}

			{onDelete && (
				<div className='text-sm border-t pt-2 mt-1'>
					{showDelete ? (
						<div className='flex flex-wrap gap-2 items-center'>
							<label className='text-xs' htmlFor={`token-${post.id}`}>Token admin:</label>
							<input
								id={`token-${post.id}`}
								type='password'
								value={token}
								onChange={(e) => setToken(e.target.value)}
								className='border px-2 py-0.5 text-sm focus-visible:outline-2 focus-visible:outline-primary-500'
							/>
							<button
								type='button'
								onClick={handleDelete}
								className='border px-2 py-0.5 cursor-pointer active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary-500'
							>
								Confirmar borrado
							</button>
							<button
								type='button'
								onClick={() => { setShowDelete(false); setError(null) }}
								className='border px-2 py-0.5 cursor-pointer active:bg-gray-200 focus-visible:outline-2 focus-visible:outline-primary-500'
							>
								Cancelar
							</button>
							{error && <span role='alert' className='text-red-700 text-xs'>{error}</span>}
						</div>
					) : (
						<button
							type='button'
							onClick={() => setShowDelete(true)}
							className='text-xs text-gray-500 underline cursor-pointer focus-visible:outline-2 focus-visible:outline-primary-500'
						>
							Borrar (admin)
						</button>
					)}
				</div>
			)}
		</article>
	)
}

export default ForoPost

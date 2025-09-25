import {useUpdatePlaylistMutation} from "@/features/playlists/api/playlistsApi.ts";
import type {SubmitHandler, UseFormHandleSubmit, UseFormRegister} from "react-hook-form";
import type {UpdatePlaylistArgs} from "@/features/playlists/api/playlistsApi.types.ts";

type Props = {
   playlistId: string
    setPlaylistId: (playlistId: null) => void
    editPlaylist: (playlist: null) => void
    register: UseFormRegister<UpdatePlaylistArgs>
    handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
}

export const EditPlaylistForm = ({playlistId, setPlaylistId, editPlaylist, register, handleSubmit}:Props) => {

    const [updatePlaylist] = useUpdatePlaylistMutation()
    const onSubmit: SubmitHandler<UpdatePlaylistArgs> = data => {
        if (!playlistId) return //если id null то возвратом все прерывается
        updatePlaylist({ playlistId, body: data }).then(() => {
            setPlaylistId(null)
        })
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Edit playlist</h2>
            <div>
                <input {...register('title')} placeholder={'title'}/>
            </div>
            <div>
                <input {...register('description')} placeholder={'description'}/>
            </div>
            <button type={'submit'}>save</button>
            <button type={'button'} onClick={() => editPlaylist(null)}>
                cancel
            </button>
        </form>
    )
}
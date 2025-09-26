import {
    useDeletePlaylistMutation,
    useFetchPlaylistsQuery,
} from "@/features/playlists/api/playlistsApi.ts";
import s from './PlaylistsPage.module.css';
import {CreatePlaylistForm} from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx";
import {useForm} from "react-hook-form";
import type {PlaylistData, UpdatePlaylistArgs} from "@/features/playlists/api/playlistsApi.types.ts";
import {useState} from "react";
import {PlaylistItem} from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx";
import {EditPlaylistForm} from "@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx";
import {useDebounceValue} from "@/common/hooks/useDebounceValue.ts";
import {Pagination} from "@/common/components/Pagination/Pagination.tsx";


export const PlaylistsPage = () => {

    const [search, setSearch] = useState('')
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const {register, handleSubmit, reset} = useForm<UpdatePlaylistArgs>()

    const debounceSearch = useDebounceValue(search)
    const {data, isLoading} = useFetchPlaylistsQuery({search:debounceSearch, pageNumber: currentPage, pageSize: 5})
    const [deletePlaylist] = useDeletePlaylistMutation()

    console.log({search})
    const deletePlaylistHandler = (playlistId: string) => {
        if (confirm(`Are you sure you want to delete playlist?`)) {
            deletePlaylist(playlistId)
        }
    }

    const editPlaylistHandler = (playlist: PlaylistData | null) => {
        if (playlist) {
            setPlaylistId(playlist.id)
            // сделаем что бы при обнавленнии в полях оставались старые значения
            reset({
                title: playlist.attributes.title,
                description: playlist.attributes.description,
                tagIds: playlist.attributes.tags.map(t => t.id),
            })
        } else {
            setPlaylistId(null)
        }
    }


    return (
        <div className={s.container}>
            <h1>Playlists page</h1>
            <CreatePlaylistForm/>
            <input
                type='search'
                placeholder='Search playlist by title'
                onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <div className={s.items}>
                {!data?.data.length && !isLoading && <h2>Playlists not found</h2>}
                {data?.data.map(playlist => {
                    const isEditing = playlist.id === playlistId
                    return (
                        <div className={s.item} key={playlist.id}>
                            {isEditing ? (
                                <EditPlaylistForm playlistId={playlist.id}
                                                  editPlaylist={editPlaylistHandler}
                                                  setPlaylistId={setPlaylistId}
                                                  register={register}
                                                  handleSubmit={handleSubmit}/>
                            ) : (
                                <PlaylistItem playlist={playlist}
                                              deletePlaylistHandler={deletePlaylistHandler}
                                              editPlaylistHandler={editPlaylistHandler}/>
                            )}

                        </div>
                    )
                })}
            </div>
            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={data?.meta.pagesCount || 1}
            />
        </div>
    )
}
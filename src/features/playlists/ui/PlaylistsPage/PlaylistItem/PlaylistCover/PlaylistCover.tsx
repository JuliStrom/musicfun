import s from "@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistCover/PlaylistItem.module.css";
import defaultCover from "@/assets/images/default-playlist-cover.png";
import {useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation} from "@/features/playlists/api/playlistsApi.ts";
import type {ChangeEvent} from "react";
import type {Images} from "@/common/types";
import {errorToast} from "@/common/utils/errorToast.ts";

type Props = {
    playlistId: string
    images: Images
}

export const PlaylistCover = ({playlistId, images}: Props) => {
    const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
    const [deleteCover] = useDeletePlaylistCoverMutation()



    const uploadPlaylistCoverHandler =(event: ChangeEvent<HTMLInputElement>) => {
        const maxSize = 1024 * 1024 // 1 MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

        const file = event.target.files?.length && event.target.files[0]
        if(!file) return
        if (!allowedTypes.includes(file.type)) {
            errorToast('Only JPEG, PNG or GIF images are allowed')
            return
        }

        if (file.size > maxSize) {
            errorToast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
            return
        }
        uploadPlaylistCover({playlistId: playlistId, file})
    }

    const deleteCovetHandler = () => deleteCover({playlistId})

    const originalCover = images.main.find(img=> img.type==='original')
    const src = originalCover ? originalCover.url : defaultCover
    return (
        <>
            <img src={src} alt="cover" width={'240px'} className={s.cover} />
            <input type="file" accept={"image/jpeg, image/png, image/gif"} onChange={uploadPlaylistCoverHandler} />
            {originalCover && <button onClick={deleteCovetHandler}>delete cover</button>}
        </>
    )
}
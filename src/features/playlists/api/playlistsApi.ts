import type {
    CreatePlaylistArgs, FetchPlaylistsArgs,
    PlaylistData,
    PlaylistsResponse,
    UpdatePlaylistArgs
} from "@/features/playlists/api/playlistsApi.types.ts";
import {baseApi} from "@/app/api/baseApi.ts";
import type {Images} from "@/common/types";


export const playlistsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
            query: params => ({ url: `playlists`, params }),
            //query: ({search}) => `playlists?search=${search}`,
            providesTags: ['Playlist']
        }),
        createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
            query: (body) => ({ method: 'post', url: 'playlists', body }),
            invalidatesTags: ['Playlist']
        }),
        deletePlaylist: build.mutation<void, string>({
            query: (playlistId) => ({ method: 'delete', url: `playlists/${playlistId}` }),
            invalidatesTags: ['Playlist']
        }),
        updatePlaylist: build.mutation<void, { playlistId:string, body:UpdatePlaylistArgs }>({
            query: ({playlistId, body}) => {
                console.log('4')
                return {method: 'put', url: `playlists/${playlistId}`, body}
            },

            async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
                const args = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')
                console.log('1')

                const patchResults: any[] = []
                args.forEach(arg => {
                    patchResults.push(
                        dispatch(
                            playlistsApi.util.updateQueryData(
                                // название эндпоинта, в котором нужно обновить кэш
                                'fetchPlaylists',
                                // аргументы для эндпоинта
                                { pageNumber: arg.pageNumber, pageSize: arg.pageSize, search: arg.search },
                                // `updateRecipe` - коллбэк для обновления закэшированного стейта мутабельным образом
                                state => {
                                    console.log('2')
                                    const index = state.data.findIndex(playlist => playlist.id === playlistId)
                                    if (index !== -1) {
                                        state.data[index].attributes = { ...state.data[index].attributes, ...body }
                                    }
                                }
                            )
                        )
                    )
                })
                try {
                    console.log('3')
                    await queryFulfilled
                    console.log('5 success')
                } catch {
                    patchResults.forEach(patchResult => {
                        patchResult.undo()
                        console.log('5 error')
                    })
                }
            },
            invalidatesTags: ['Playlist']
        }),
        uploadPlaylistCover: build.mutation<Images, { playlistId:string, file:File }>({
            query: ({playlistId, file}) => {
                const formData = new FormData()
                formData.append('file', file)
                return ({method: 'post', url: `playlists/${playlistId}/images/main`, body: formData})
            },
            invalidatesTags: ['Playlist']
        }),
        deletePlaylistCover: build.mutation<void, {playlistId:string}>({
            query: ({playlistId}) => ({method: 'delete', url: `playlists/${playlistId}/images/main`}),
            invalidatesTags: ['Playlist']
        })
    })
})

export const {useFetchPlaylistsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistMutation,
    useUpdatePlaylistMutation, useUploadPlaylistCoverMutation, useDeletePlaylistCoverMutation} = playlistsApi
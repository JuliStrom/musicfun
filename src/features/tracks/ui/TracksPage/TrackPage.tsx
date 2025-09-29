import {useFetchTracksInfiniteQuery} from "@/features/tracks/api/tracksApi.ts";
import s from './TracksPage.module.css'
import {useInfiniteScroll} from "@/common/hooks";
import {TracksList} from "@/features/tracks/ui/TracksPage/TracksList/TracksList.tsx";
import {LoadingTrigger} from "@/features/tracks/ui/TracksPage/LoadingTrigger.tsx";

export const TracksPage = () => {
    const {data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage} = useFetchTracksInfiniteQuery()


    const {observerRef} = useInfiniteScroll({fetchNextPage, hasNextPage, isFetching})
    const pages = data?.pages.flatMap((page) => page.data) || []



    //const observerRef = useRef<HTMLDivElement>(null)
    //const pages = data?.pages.map(page => page.data).flat() || []


    // const loadMoreHandler = () => {
    //     if(hasNextPage && !isFetching) {
    //         fetchNextPage()
    //     }
    // }

    // const loadMoreHandler = useCallback(() => {
    //     if (hasNextPage && !isFetching) {
    //         fetchNextPage()
    //     }
    // }, [hasNextPage, isFetching, fetchNextPage])

    // useEffect(() => {
    //     // IntersectionObserver отслеживает элементы и сообщает, насколько они видны во viewport
    //     // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    //     const observer = new IntersectionObserver(
    //         (entries) => {
    //             // entries - наблюдаемый элемент
    //             if (entries.length > 0 && entries[0].isIntersecting) {
    //                 loadMoreHandler()
    //             }
    //         },
    //         {
    //             root: null, // Отслеживание относительно окна браузера (viewport). null = весь экран
    //             rootMargin: '100px', // Начинать загрузку за 100px до появления элемента
    //             threshold: 0.1, // Срабатывать когда 10% элемента становится видимым
    //         }
    //     )
    //
    //     const currentObserverRef = observerRef.current
    //     if (currentObserverRef) {
    //         // начинает наблюдение за элементом
    //         observer.observe(currentObserverRef)
    //     }
    //
    //     // Функция очистки - прекращает наблюдение при размонтировании компонента
    //     return () => {
    //         if (currentObserverRef) {
    //             observer.unobserve(currentObserverRef)
    //         }
    //     }
    // }, [loadMoreHandler])

    return (
        <div>
            <h1>Tracks page</h1>
            <div className={s.list}>
                <TracksList tracks={pages}/>
            </div>

            {/*{!isLoading && (*/}
            {/*    <>*/}
            {/*        {hasNextPage ? (*/}
            {/*            <button onClick={loadMoreHandler} disabled={isFetching}>*/}
            {/*                {isFetchingNextPage ? 'Loading...' : 'Load More'}*/}
            {/*            </button>*/}
            {/*        ) : (*/}
            {/*            <p>Nothing more to load</p>*/}
            {/*        )}*/}
            {/*    </>*/}
            {/*)}*/}

            {hasNextPage && (<LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage}/>)}

            {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
        </div>
    )
}
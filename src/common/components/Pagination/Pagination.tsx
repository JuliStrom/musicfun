import s from './Pagination.module.css'
import {PaginationControls} from "@/common/components/Pagination/PaginationControls/PaginationControls.tsx";
import {PageSizeSelector} from "@/common/components/Pagination/PageSizeSelector/PageSizeSelector.tsx";


type Props = {
    currentPage: number
    setCurrentPage: (page: number) => void
    pagesCount: number
    pageSize: number
    changePageSize: (size: number) => void
}

export const Pagination = ({currentPage, setCurrentPage, pagesCount, pageSize, changePageSize}: Props) => {
    if (pagesCount <= 1) return null

    return (
        <div className={s.container}>
            <PaginationControls
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pagesCount={pagesCount}/>
            <PageSizeSelector
                pageSize={pageSize}
                changePageSize={changePageSize}/>
        </div>
    )
}
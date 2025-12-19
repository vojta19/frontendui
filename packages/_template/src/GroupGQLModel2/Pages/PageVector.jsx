
import { PageNavbar } from "./PageNavbar"
import { ReadAsyncAction, ReadPageAsyncAction } from "../Queries"
import { useInfiniteScroll } from "./useInfiniteScroll"
import { Table } from "../../Base/Components/Table"
import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"
import { useRef } from "react"

export const PageVector = ({ children, queryAsyncAction=ReadPageAsyncAction }) => {
    const scrollBoxRef = useRef(null);
    const { items, loading, error, hasMore, sentinelRef, loadMore } = useInfiniteScroll(
        {rootRef: scrollBoxRef, asyncAction:queryAsyncAction, actionParams: { skip: 0, limit: 1 }}
    )
    
    // const items = []
    return (
        <div ref={scrollBoxRef} style={{ overflow: "auto", height: 600 }}>
            <PageNavbar />
            PageVector {`${hasMore}`}
            <Table data={items} />
            
            {error && <ErrorHandler errors={error} />}
            {loading && <LoadingSpinner text="Nahrávám další..." />}
            
            {hasMore && <div ref={sentinelRef} style={{ height: 80, backgroundColor: "red" }} />}            
            {hasMore && <button className="btn btn-success form-control" onClick={() => loadMore()}>Více</button>}  
        </div>
    )
}


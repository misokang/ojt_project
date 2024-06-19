import {Fragment, useContext} from "react";
import {QueryCache, QueryClient, QueryClientProvider, useQueryErrorResetBoundary} from "@tanstack/react-query";
import {ErrorBoundary} from "react-error-boundary";
import {modalContext} from "@/components/common/Context/Modal";

const QueryProvider = (props) => {
    const modal = useContext(modalContext);
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 0,
                //query boundary 컴포넌트 사용시
                //throwOnError : true
            }
        },
        queryCache : new QueryCache({
            onError : (error) => {
                console.log(error);
                //modal.showAlert("알림","처리 중 오류가 발생하였습니다.");
            }
        })
    });

    return (
        <Fragment>
            <QueryClientProvider client={queryClient}>
                <QueryErrorBoundary>
                    {props.children}
                </QueryErrorBoundary>
            </QueryClientProvider>
        </Fragment>
    );
};

const QueryErrorBoundary = ({children}) => {
    const reset = useQueryErrorResetBoundary();
    return (
        <Fragment>
            <ErrorBoundary
                onReset={reset}
                fallbackRender={() => {
                    //에러에 대한 팝업 처리 -> component 형태
                    return null;
                }}>
                {children}
            </ErrorBoundary>
        </Fragment>
    )
} ;

export default QueryProvider;
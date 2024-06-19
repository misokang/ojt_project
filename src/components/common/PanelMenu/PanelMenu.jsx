import {memo, useEffect} from 'react';
import {PanelBar, PanelBarItem} from '@progress/kendo-react-layout';
import '@/components/PanelMenu/PanelMenu.css';

/**
 * 메뉴 컴포넌트
 *
 * @author chauki
 * @version 1.0
 **/
 const PanelMenu = (props) => {

    //todo componentDidMount
    useEffect(() => {
        //todo component mount 시, 로직 처리
    }, []);

    //todo componentDidUpdate
    useEffect(() => {
        //todo component update 시, 로직 처리
    });

    //todo componentWillUnmounts
    useEffect(() => {
        return () => {
            //todo component unmount 시, 로직 처리
        }
    }, []);

    /**
     * 메뉴 선택 시, 이벤트 핸들러
     * - 해당 컴포넌트에 대한 페이지를 호출한다.
     *
     * @param e 이벤트 객체
     * @author chauki
     * @version 1.0
     **/
    const handleItemSelect = (e) => {
        if (props.onSelect && props.onSelect instanceof Function) {
            props.onSelect.call(e);
        }

        if (e.target.props.content != undefined) {
            props.history.push(`${props.match.path}${e.target.props.content}`);
        }
    };

    return (
        <div className={"wdFull"}>
            <PanelBar onSelect={handleItemSelect}>
                <PanelBarItem
                    expanded={true}
                    animation={true}
                    root={true}
                    selected={true}
                    title={"Components"}
                    content={"/intro"}
                    className={"lv0"}>
                    <PanelBarItem expanded={true} title={"컴포넌트"} className={"lv1"}>
                        <PanelBarItem title={"인증"} className={"lv2"}>
                            <PanelBarItem title={"로그인"} className={"lv3"} content={"/auth/login"} />
                        </PanelBarItem>
                        <PanelBarItem title={"유저"} className={"lv2"}>
                            <PanelBarItem title={"사용자 수정"} className={"lv3"} content={"/user/detail"} />
                            <PanelBarItem title={"비밀번호 변경"} className={"lv3"} content={"/user/pwd/change"} />
                            <PanelBarItem title={"회원가입"} className={"lv3"} content={"/user/join"} />
                            <PanelBarItem title={"아이디찾기"} className={"lv3"} content={"/user/search/id"} />
                            <PanelBarItem title={"아이디찾기 결과"} className={"lv3"} content={"/user/search/id/result"} />
                            <PanelBarItem title={"비밀번호 초기화"} className={"lv3"} content={"/user/pwd/reset"} />
                            <PanelBarItem title={"사용자 목록"} className={"lv3"} content={"/user/list"} />
                        </PanelBarItem>
                        <PanelBarItem title={"상단메뉴"} className={"lv2"}>
                            {/*<PanelBarItem title={"이벤트알림"} className={"lv3"} content={"/menu/top/event"} />*/}
                            <PanelBarItem title={"네비게이션메뉴"} className={"lv3"} content={"/menu/top/navi"} />

                        </PanelBarItem>
                        <PanelBarItem title={"지도"} className={"lv2"}>
                            <PanelBarItem title={"좌표찾기"} className={"lv3"} content={"/map/search/coords"} />
                            <PanelBarItem title={"측량"} className={"lv3"} content={"/map/measure"} />
                            <PanelBarItem title={"POI"} className={"lv3"} content={"/map/poi"} />
                            {/*<PanelBarItem title={"교통축설정"} className={"lv3"} content={"/map/trafficaxis"} />*/}
                        </PanelBarItem>
                        <PanelBarItem title={"공통"} className={"lv2"}>
                            <PanelBarItem title={"우편번호"} className={"lv3"} content={"/common/postcode"} />
                            <PanelBarItem title={"지역코드"} className={"lv3"} content={"/common/admcode"} />
                            <PanelBarItem title={"기본"} className={"lv3"} content={"/common/basic"} />
                        </PanelBarItem>
                        <PanelBarItem title={"공휴일 관리"} className={"lv2"}>
                            <PanelBarItem title={"공휴일 조회"} className={"lv3"} content={"/holiday/list"} />
                        </PanelBarItem>
                        <PanelBarItem title={"Los"} className={"lv2"}>
                            <PanelBarItem title={"사이드바"} className={"lv3"} content={"/los/sidebar"} />
                            <PanelBarItem title={"화면"} className={"lv3"} content={"/los/simulator"} />
                        </PanelBarItem>
                        <PanelBarItem title={"VOD"} className={"lv2"}>
                            <PanelBarItem title={"상시 VOD 목록"} className={"lv3"} content={"/vod/live/list"} />
                            <PanelBarItem title={"돌발 이벤트 VOD 목록"} className={"lv3"} content={"/vod/event/list"} />
                        </PanelBarItem>
                        <PanelBarItem title={"교차로 정보 관리"} className={"lv2"}>
                            <PanelBarItem title={"교차로 목록"} className={"lv3"} content={"/intersection/list"} />
                            <PanelBarItem title={"교차로 검색"} className={"lv3"} content={"/intersection/search"} />
                            <PanelBarItem title={"교차로 교통축 설정"} className={"lv3"} content={"/intersection/trafficaxis"} />
                            <PanelBarItem title={"교차로 방면 검색(통계)"} className={"lv3"} content={"/intersection/boundsearch"} />
                        </PanelBarItem>
                        <PanelBarItem title={"카메라"} className={"lv2"}>
                            <PanelBarItem title={"카메라 등록"} className={"lv3"} content={"/camera/register"} />
                            <PanelBarItem title={"카메라 수정"} className={"lv3"} content={"/camera/detail"} />
                            <PanelBarItem title={"카메라 목록"} className={"lv3"} content={"/camera/list"} />
                            <PanelBarItem title={"카메라 검색"} className={"lv3"} content={"/camera/search"} />
                            <PanelBarItem title={"교차로별 카메라 목록"} className={"lv3"} content={"/camera/list/simple"} />
                            <PanelBarItem title={"카메라 썸네일"} className={"lv3"} content={"/camera/thumbnail"} />
                            <PanelBarItem title={"카메라 POI"} className={"lv3"} content={"/camera/poi"} />
                        </PanelBarItem>
                        <PanelBarItem title={"윈포윈도우"} className={"lv2"}>
                            <PanelBarItem title={"카메라 인포윈도우"} className={"lv3"} content={"/info/camera"} />
                            <PanelBarItem title={"교차로 인포윈도우"} className={"lv3"} content={"/info/intersection"} />
                            <PanelBarItem title={"교차로 LOS 인포윈도우"} className={"lv3"} content={"/info/intersection/los"} />
                            <PanelBarItem title={"교차로 방면 인포윈도우"} className={"lv3"} content={"/info/intersection/bound"} />
                            <PanelBarItem title={"교통축 인포윈도우"} className={"lv3"} content={"/info/intersection/axis"} />
                        </PanelBarItem>
                        <PanelBarItem title={"분석엔진"} className={"lv2"}>
                            <PanelBarItem title={"분석엔진 목록"} className={"lv3"} content={"/engine/list"} />
                            <PanelBarItem title={"분석엔진 등록"} className={"lv3"} content={"/engine/register"} />
                            <PanelBarItem title={"분석엔진 수정"} className={"lv3"} content={"/engine/detail"} />
                        </PanelBarItem>
                        <PanelBarItem title={"플랫폼서버"} className={"lv2"}>
                            <PanelBarItem title={"플랫폼서버 목록"} className={"lv3"} content={"/server/list"} />
                            <PanelBarItem title={"플랫폼서버 등록"} className={"lv3"} content={"/server/register"} />
                            <PanelBarItem title={"플랫폼서버 수정"} className={"lv3"} content={"/server/detail"} />
                        </PanelBarItem>
                        <PanelBarItem title={"ROI"} className={"lv2"}>
                            <PanelBarItem title={"돌발속성설정 - 기본정보"} className={"lv3"} content={"/roi/aids/basic"} />
                            <PanelBarItem title={"돌발속성설정 - 이벤트상세설정"} className={"lv3"} content={"/roi/aids/attr"} />
                            <PanelBarItem title={"ROI 컨트롤"} className={"lv3"} content={"/roi/control"} />
                            <PanelBarItem title={"ROI 프리셋 추가"} className={"lv3"} content={"/roi/preset"} />
                        </PanelBarItem>
                        <PanelBarItem title={"비디오"} className={"lv2"}>
                            <PanelBarItem title={"비디오 플레이어"} className={"lv3"} content={"/video/player"} />
                            <PanelBarItem title={"비디오 실시간 플레이어"} className={"lv3"} content={"/video/stream/player"} />
                        </PanelBarItem>
                    </PanelBarItem>
                </PanelBarItem>
            </PanelBar>
        </div>
    );
};
export default memo(PanelMenu);

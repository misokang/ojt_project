import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as bootstrap from 'bootstrap'

/* 기본 contextAPI 컴포넌트 */
import {ModalProvider} from '@/components/common/Context/Modal';
import {LoadingProvider} from '@/components/common/Context/LoadingSpinner';
import {NotificationProvider} from '@/components/common/Context/Notification';
import {WindowPopupProvider} from "@/components/common/Context/WindowPopup";
/*import QueryProvider from "@/components/common/Context/QueryProvider";*/
/* redux */
import {Provider} from 'react-redux';
import store from '@/redux/store/Store';
import {PersistGate} from "redux-persist/integration/react";
import {persistor} from "@/redux/store/StorePersist";

/* kendo react 한글 컴포넌트 관련 */
import likelySubtags from "cldr-core/supplemental/likelySubtags.json";
import currencyData from "cldr-core/supplemental/currencyData.json";
import weekData from "cldr-core/supplemental/weekData.json";
import numbers from "cldr-numbers-full/main/ko-KP/numbers.json";
import caGregorian from "cldr-dates-full/main/ko-KP/ca-gregorian.json";
import dateFields from "cldr-dates-full/main/ko-KP/dateFields.json";
import timeZoneNames from "cldr-dates-full/main/ko-KP/timeZoneNames.json";
import {IntlProvider, load, loadMessages, LocalizationProvider} from "@progress/kendo-react-intl";
import language from "@/language/language.json";

caGregorian.main['ko-KP'].dates.calendars.gregorian.dateTimeFormats.availableFormats.d = 'd';

load(
    likelySubtags,
    currencyData,
    weekData,
    numbers,
    caGregorian,
    dateFields,
    timeZoneNames
);
loadMessages(language, "lan");


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
              <LocalizationProvider language={'lan'}>
                  <IntlProvider locale={'ko-KP'}>
                      <LoadingProvider>
                          <NotificationProvider>
                              <ModalProvider>
                                  <WindowPopupProvider>
                                      {/*<QueryProvider>*/}
                                          <App />
                                      {/*</QueryProvider>*/}
                                  </WindowPopupProvider>
                              </ModalProvider>
                          </NotificationProvider>
                      </LoadingProvider>
                  </IntlProvider>
              </LocalizationProvider>
          </PersistGate>
      </Provider>
  </React.StrictMode>,
)

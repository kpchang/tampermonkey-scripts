// ==UserScript==
// @name         公文系統
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       KP
// @match        https://emsodas.cht.com.tw/Portal/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 添加小秘書按鈕
    const addInputToElement = () => {
        const targetElement = document.getElementById('ctl00_PlaceHolderMain_EmsListBoardUserControl1_ButtonColumn');

        if (targetElement) {
            const secretaryStartElement = document.createElement('input');
            secretaryStartElement.type = 'text';
            secretaryStartElement.value = '小秘書幫你';
            secretaryStartElement.classList.add('btnGo');
            secretaryStartElement.style.paddingTop = '0';
            secretaryStartElement.style.paddingBottom = '0';
            secretaryStartElement.style.width = '75px';
            targetElement.appendChild(secretaryStartElement);
            secretaryStartElement.addEventListener('click', start);
            const secretaryStopElement = document.createElement('input');
            secretaryStopElement.type = 'text';
            secretaryStopElement.value = '小秘書停止';
            secretaryStopElement.classList.add('btnGo');
            secretaryStopElement.style.paddingTop = '0';
            secretaryStopElement.style.paddingBottom = '0';
            secretaryStopElement.style.width = '75px';
            targetElement.appendChild(secretaryStopElement);
            secretaryStopElement.addEventListener('click', stop);
        } else {
            console.log('找不到目標元素。');
        }
    };

    // 小秘書啟動
    const start = () => {
        sessionStorage.setItem('secretary', 'true');
        secretaryStart();
    };
    // 小秘書停止
    const stop = () => {
        sessionStorage.setItem('secretary', 'false');
    };
    //小秘書啟動
    const secretaryStart = () => {
        const isSecretary = sessionStorage.getItem('secretary') === 'true';
        if (isSecretary) {
            const tdElements = document.querySelectorAll('td.DocSubject');
            if (tdElements && tdElements.length > 0) {
                tdElements[0].querySelector('a').click();
            } else {
                alert('沒有公文囉');
            }
        } else {
            console.log('不是秘書，不執行 click 操作。');
        }
    };
    const DocumentListPage = () => {
        if ( window.location.href == 'https://emsodas.cht.com.tw/Portal/Pages/WaitingDocument.aspx') {
            secretaryStart();
        }
    };

    const singleDocumentPage = () => {
        if (window.location.href.includes("ID=")) {
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        for (const addedNode of mutation.addedNodes) {
                            // 检查是否包含 class="ok" 的元素
                            if (addedNode.classList.contains('popupDialog')) {
                                console.log('包含 class="popupDialog" 的元素出现了！');
                                setTimeout(function() {
                                    clickIframeOkButtom();
                                }, 1000);
                            }
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            // 點擊確認公文按鈕
            const containerElement = document.getElementById('ctl00_PlaceHolderMain_Ribbon_TabContainer_ctl08');
            if (containerElement) {
                const inputElements = containerElement.querySelectorAll('input[value="確認"]');
                if(inputElements.length > 0){
                    inputElements[0].click();
                }
            }
        }
    };
    function clickIframeOkButtom(){
        var popupDialog = document.querySelector('.popupDialog');
        if (popupDialog) {
            var iframe = popupDialog.querySelector('iframe');
            if (iframe) {
                var iframeWindow = iframe.contentWindow;
                if (iframeWindow) {
                    var buttonInIframe = iframeWindow.document.getElementById('OkButton');
                    if (buttonInIframe) {
                        console.log('成功獲取到 iframe 內部的按鈕對象:', buttonInIframe);
                        buttonInIframe.click();
                    } else {
                        console.log('在 iframe 內部未找到按鈕元素。');
                    }
                } else {
                    console.log('未能獲取 iframe 內部文檔的 window 對象。');
                }
            } else {
                console.log('在 div 元素內未找到嵌套的 iframe 元素。');
            }
        } else {
            console.log('未能獲取包含 class 為 "popupDialog" 的 div 元素。');
        }
    }

    // 加入小秘書
    addInputToElement();
    //處理公文清單頁面
    DocumentListPage();
    //處理單一公文頁面
    singleDocumentPage();

})();
"ui";
auto();

if (floaty && floaty.hasOwnProperty("checkPermission") && !floaty.checkPermission()) {
    floaty.requestPermission(); toast("请先开启悬浮窗权限再运行,否则无法显示提示"); exit()
}

//线程执行其任务
var thread = null
//序列化数据到本地
var storage = storages.create("walkingsky");

var ii = 0; jj = 0 //定时触发准备的全局变量

var thread_egg = null
var thread_swipe = null
var thread_egg_id = null
var thread_swipe_id = null

//----------------------------------------------
//消息提示
function toast_console(msg, tshow) {
    console.log(msg);
    tshow = true
    if (tshow) toast(msg);
}

//点击控件所在坐标
function btn_position_click(x) { if (x) click(x.bounds().centerX(), x.bounds().centerY()) }

// 按文本查找按钮，并点击
function click_by_text(txt) {
    let btn = text(txt).findOne(5000)
    if (!btn) {
        console.log('没找到‘' + txt + '’按钮')
        return;
    }
    btn_position_click(btn)
}

// 按desc文本查找按钮，并点击
function click_by_desc(txt) {
    let btn = desc(txt).findOne(5000);
    if (!btn) {
        console.log('没找到‘' + txt + '’按钮')
        return;
    }
    btn_position_click(btn)
}

// 按id文本查找按钮，并点击
function click_by_id(id_str) {
    let btn = id(id_str).findOne(5000);
    if (!btn) {
        console.log('没找到‘' + id_str + '’按钮')
        return;
    }
    btn_position_click(btn)
}


// 按文本包含内容查找按钮，并点击
function click_by_textcontains(txt) {
    let btn = textContains(txt).findOne(5000);
    if (!btn) {
        console.log('没找到‘' + txt + '’按钮')
        return false;
    }
    btn_position_click(btn)
    return true
}

function click_bounds(x1, y1, x2, y2) {
    x = x1 + (x2 - x1) / 2
    y = y1 + (y2 - y1) / 2
    click(x, y)
}

// 截屏查找图片颜色并单击对应的点
function cs_click(num, rgb, xr, yr, wr, hr, flipup) {
    while (num--) {
        let img = captureScreen()
        if (flipup != undefined) img = images.rotate(img, 180)
        let point = findColor(img, rgb, { region: [img.getWidth() * xr, img.getHeight() * yr, img.getWidth() * wr, img.getHeight() * hr], threshold: 8 })
        if (point) {
            if (flipup != undefined) {
                point.x = img.getWidth() - point.x; point.y = img.getHeight() - point.y
            }
            return click(point.x, point.y);
        }
        if (num) sleep(1000)
    }
    return false
}

//在屏幕上匹配图片，匹配到就点击
function find_images(num, img_file, flipup, color, threshold) {
    let templ = images.read(img_file);
    //toast_console('color:' + color + ';threshold:' + threshold)
    if (color == undefined)
        templ = images.grayscale(templ)
    while (num--) {
        let img = captureScreen()
        if (flipup != undefined) img = images.rotate(img, 180)
        if (color == undefined)
            img = images.grayscale(img)
        if (threshold != undefined) threshold = 0.9
        else
            threshold = threshold
        let point = findImage(img, templ, {
            threshold: threshold //图片相似度
        })
        if (point) {
            if (flipup != undefined) {
                point.x = img.getWidth() - point.x; point.y = img.getHeight() - point.y
            }
            toast_console('找到了‘' + img_file + '’图片');
            return click(point.x, point.y);
        }
        if (num) sleep(1000)
    }
    toast_console('没找到‘' + img_file + '’图片');
    return false
}

//浏览15秒钟页面操作
function view_15seconds() {
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 1500)
    sleep(18000)
}

// 浏览3次 的任务
//title 点击任务名称
// num 执行次数
//colse ，部分任务没有返回领取积分的按钮，只能点右上角的关闭按钮返回
function view(title, num, close) {
    let i = 0
    for (; i < num; i++) {
        if (click_by_textcontains(title) == false)
            return
        //i = 3
        sleep(2000)
        my_btn = text("去完成").clickable(true).depth(16).findOne(3000)
        if (!my_btn) {
            toast_console('没找到‘' + title + '’弹层按钮');
            return
        } else btn_position_click(my_btn)
        sleep(2000)
        view_15seconds()
        //按照返回按钮的颜色点击返回
        //cs_click(2, '#243db3', 0.8, 0.7, 0.1, 0.2)
        if (undefined != close) {
            let no_image = find_images(6, './img/返回领积分按钮.jpg', undefined, true)
            if (!no_image)
                click_bounds(952, 1632, 1078, 1770) //识别不到图片就硬性点击按钮位置
        }
        sleep(2000)
    }
    if (close != undefined)
        click_by_desc('关闭')
}

//做任务
function do_task(title) {
    if (click_by_textcontains(title) == false)
        return
    sleep(2000)
    my_btn = text("去完成").clickable(true).depth(16).findOne(3000)
    if (!my_btn) {
        toast_console('没找到‘' + title + '’弹层按钮');
        return
    } else btn_position_click(my_btn)
    sleep(5000)
    //重新激活 支付宝
    app.launch("com.eg.android.AlipayGphone");
    sleep(1000)
    //按照返回按钮的颜色点击返回
    //cs_click(2, '#243db3', 0.8, 0.4, 0.9, 0.8)
    let no_image = find_images(6, './img/返回领积分按钮.jpg', undefined, true)
    if (!no_image)
        click_bounds(952, 1632, 1078, 1770) //识别不到图片就硬性点击按钮位置

}


//------------------------------------------------------------


// 支付宝领积分的操作函数
function alipay_points() {
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    let my_btn = text('我的').findOne(5000)
    if (!my_btn) {
        toast_console('没找到‘我的’按钮，退出');
        //exit();
        return
    }
    btn_position_click(my_btn)
    sleep(3000)
    click(540, 500)//直接点击坐标点
    sleep(3000)
    click_by_text('全部领取')
    sleep(2000)
    click_by_textcontains('每日')
    sleep(2000)
    click_by_text('逛15秒赚3积分')
    my_btn = textContains('已完成浏览任务').findOne(3000)
    //toast_console(my_btn)
    if (!my_btn)
        sleep(16000)
    sleep(5000)
    click_by_text('做任务赚积分')
    sleep(2000)
    let i = 3
    do {
        view('逛精选好物会场15秒', 3)
        sleep(2000)
        view('逛红包会场15秒', 3)
        sleep(2000)
        view('逛红包优品会场15秒', 3)
        sleep(2000)
        view('逛15s医保服务', 1, true)
        sleep(2000)
        view('去百度逛一逛领好礼', 1)
        sleep(2000)
        view('逛15s天猫超市', 1, true)
        sleep(2000)
        view('15s逛一逛商品橱窗', 1)
        sleep(2000)
        do_task('逛一逛芭芭农场')
        sleep(2000)
        do_task('逛一逛蚂蚁森林')
        sleep(2000)
        do_task('逛淘金币小镇领金币')
        sleep(3000)
        app.launch("com.eg.android.AlipayGphone")  //从淘宝切回支付宝
        let no_image = find_images(6, './img/返回领积分按钮.jpg', undefined, true)
        //sleep(2000)
        //if (!no_image)
        //    click_bounds(952, 1632, 1078, 1770) //识别不到图片就硬性点击按钮位置
        sleep(2000)
        do_task('蚂蚁庄园')
        sleep(2000)
        i--
    } while (i > 0) // 循环执行多次，防止有些项排在下边展示不出来


    click_by_desc('返回')
    sleep(2000)

    click_by_desc('返回')
    sleep(2000)

    click_by_text('首页')
    sleep(2000)

    toast_console('执行结束');
}


//--芭芭农场---------------------------------------------------------------------

//领取奖励
function farm_lingjiang() {
    click_by_textcontains('点击领奖')
    sleep(2000)
    click_by_text('立即领取')
}

//浏览得肥料
function farm_view() {
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 1500)
    sleep(18000)
    if (!click_by_desc('返回'))
        click_by_id('J-farm-cpc-countdown')
}

function baba_farm_task() {
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    click_by_text('芭芭农场')
    sleep(5000)
    //签到领肥料
    find_images(3, './img/芭芭农场_领取肥料.jpg')
    //打开领肥料任务列表
    sleep(2000)
    task = find_images(3, './img/芭芭农场_领取肥料任务按钮.jpg')
    if (task) {
        sleep(2000)
        //签到领取
        click_by_text('领取')
        sleep(2000)

        while (find_images(3, './img/芭芭农场任务列表去完成.jpg')) {
            sleep(5000)
            farm_view()
        }
        //关闭任务弹层
        click_by_text('关闭')
    }
    //施肥
    sleep(2000)
    let keyi_shifei = true
    while (keyi_shifei) {
        if (find_images(3, './img/芭芭农场_施肥按钮.jpg')) {
            sleep(2000)
            if (text('已领取').findOne(5000)) {
                toast_console('任务列表弹出，说明不能再施肥了');
                keyi_shifei = false
                //关闭任务弹层
                click_by_text('关闭')
            }
            sleep(2000)
            if (click_by_textcontains('点击领取')) {
                farm_lingjiang()
                sleep(2000)
            }
        }

    }
    sleep(3000)
    //领奖
    while (click_by_textcontains('点击领取')) {
        farm_lingjiang()
        sleep(2000)
    }
    //关闭，退出
    click_by_desc('关闭')
}

// -------蚂蚁森林-------------------
function paopao() {
    for (let i = 0; i < 5; i++)
        find_images(3, './img/大气泡color.jpg', undefined, true)
}

function ant_forest_task() {
    app.launch("com.eg.android.AlipayGphone");
    sleep(5000);
    click_by_text('蚂蚁森林')
    sleep(3000)
    paopao()
    find_images(3, './img/小气泡.jpg', undefined, true)
    sleep(1000)
    let a = find_images(3, './img/保护地.jpg')
    if (!a) //如果没找到图片就直接点击位置
        click_bounds(80, 1230, 200, 1370)
    sleep(2000)
    click_by_textcontains('开始巡护')
    sleep(3000)
    //视频
    click_by_text('不看了，继续前进')
    click_by_text('观看视频')
    //继续前进
    click_by_text('继续前进')
    //加好友
    let friend = text('邀请好友得巡护机会').findOne(5000)
    if (friend)
        click_bounds(504, 1467, 576, 1542)

    //关闭，退出
    click_by_desc('关闭')
    sleep(2000)
    //关闭，退出
    click_by_desc('关闭')
}

//---淘宝芭芭农场(变量太多，不再完成)--------------------------------------------------------------------

function taobao_farm_task() {
    app.launch('com.taobao.taobao')
    sleep(5000)
    click_by_text('芭芭农场')
    sleep(5000)

    find_images(3, './img/淘宝芭芭农场领取肥料.jpg')
    sleep(2000)
    find_images(3, './img/淘宝芭芭农场兔子领取肥料.jpg')
    sleep(2000)
    //点击集肥料
    click_bounds(720, 1926, 885, 2109)
    sleep(2000)
    click_by_text('去签到')
    sleep(2000)

    click_by_text('去逛逛')
    farm_view()
    sleep(2000)
    click_by_text('去浏览')
    farm_view()
    sleep(2000)
    click_by_text('去浏览')
    farm_view()
    sleep(2000)
    click_by_text('去浏览')
    farm_view()
    sleep(2000)
    click_by_text('去领取')
    farm_view()
    sleep(2000)

    click_by_text('关闭')


    let keyi_shifei = true
    while (keyi_shifei) {
        //点击施肥 
        click_bounds(15, 1920, 1068, 2109)
        sleep(2000)
        if (text('关闭').findOne(5000)) {
            toast_console('任务列表弹出，说明不能再施肥了');
            keyi_shifei = false
            //关闭任务弹层
            click_by_text('关闭')
        }
    }


}


//  点淘-------------------------------------------------
//看直播60秒
function view_live() {
    let live = click_by_textcontains('看直播60秒') //看直播的按钮
    sleep(1000)
    if (live) {
        while (true) {
            //if (id('gold_egg_image').exists()) { click_by_id('gold_egg_image'); console.log('点击金蛋领奖') }
            //翻倍操作
            if (id('gold_action_text').exists())
                if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                    click_by_id('gold_action_layout')

            if (!textContains('后完成').exists())
                break
            sleep(1000)
        }
        click_by_id('taolive_close_btn')
    }
}

//签到
function taolive_sign() {
    click_by_text('今日签到')
    sleep(2000)
    view_live()
    className("android.view.View").clickable(true).depth(16).findOne().click() //返回元宝中心
}

//点淘签到任务
function diantao_task() {
    app.launch('com.taobao.live')
    sleep(5000)
    //click_by_id('hp3_tab_img')
    //每天第一次进入app ，有个青少年模式提示，点击任意地方会关闭这个弹层提示
    find_images(3, './img/元宝中心按钮.jpg', undefined, true)
    sleep(500)
    find_images(3, './img/元宝中心按钮.jpg', undefined, true)
    sleep(3000)
    //每日收益
    if (click_by_text('每日收益')) {
        sleep(4000)
        click_bounds(0, 84, 123, 213)
    }
    sleep(1000)
    //领取奖励
    click_by_text('领取奖励')
    sleep(500)
    view_live()
    sleep(1000)
    taolive_sign()
    sleep(1000)
    //click_by_text('text = O1CN01LxFPWH1Mmy2hurJW4_!!6000000001478-2-tps-54-54.png_') //关闭弹层按钮
    //提现
    click_by_text('提现')
    sleep(2000)
    click_by_text('提现到支付宝')
    sleep(2000)
    click_by_text('确认提现')
    sleep(2000)
    click_by_desc('转到上一层级')
}
//转换时间字符串到秒钟
function str_to_seconds(str) {
    console.log(str)
    let arr = str.split(':')
    console.log(arr)
    if (arr.length == 3)
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2])
    else
        return false
}

function get_remaining() {
    console.log('获取领奖剩余时间')
    let remaining = 0
    let a = className('android.view.View').depth(28).indexInParent(1).find()
    console.log(a.length)
    try {
        var re = /\d{2}:\d{2}:\d{2}/
        a.forEach(element => {
            if (element.text() == '领取奖励') {
                console.log('领取奖励')
                element.click()
                view_live()
                sleep(1000)
                throw new Error()
            }
            if (re.exec(element.text())) {
                remaining = str_to_seconds(element.text())
                throw new Error()
            }
        });
        return -1 //没找到领奖标识，返回-1 
    } catch (e) {
        console.log(e.msg)
    }
    console.log('领奖剩余时间：' + remaining)
    return remaining
}


//点淘刷元宝任务
function diantao_yuanbao() {
    let remaining = 0 //领奖剩余时间，单位秒
    app.launch('com.taobao.live')
    sleep(5000)
    //click_by_id('hp3_tab_img')
    find_images(3, './img/元宝中心按钮.jpg', undefined, true)
    sleep(4000)
    let retry_count = 6
    while (true) {
        remaining = get_remaining()
        if (remaining == 0)
            remaining = get_remaining()
        else if (remaining == -1) {
            retry_count--
            sleep(1000)
            if (retry_count < 0)
                break //没找到领奖标志，就退出
        }
        else {
            let start = Date.parse(new Date()) / 1000  //开始计时

            //返回视频列表
            if (!id('taolive_close_btn').exists()) {
                if (className('android.view.View').depth(25).indexInParent(1).findOne())
                    className('android.view.View').depth(25).indexInParent(1).findOne().click()
                /*
                sleep(1000)
                if (className('android.widget.FrameLayout').depth(23).indexInParent(1).findOne())
                    className('android.widget.FrameLayout').depth(23).indexInParent(1).findOne().click()
                */
                sleep(1000)
                click_by_text('观看')
            }
            ii = 0
            jj = 0
            console.log('jj:' + jj + 'ii:' + ii)

            while (Date.parse(new Date()) / 1000 - start <= remaining) {

                if (id('gold_egg_image').exists() && jj == 0) {
                    jj = 1
                    console.log('jj:' + jj + 'ii:' + ii)
                    thread_egg = threads.start(function () {
                        thread_egg_id = setTimeout(() => {
                            jj = 0
                            click_by_id('gold_egg_image')
                            console.log('点击金蛋领奖')
                            return
                        }, 40000)
                    })

                }
                if (ii == 0) {
                    ii = 1
                    console.log('jj:' + jj + 'ii:' + ii)
                    thread_swipe = threads.start(function () {
                        thread_swipe_id = setTimeout(() => {
                            ii = 0
                            swipe(device.width / 2, device.height * 0.9, device.width / 2, device.height * 0.1, 700)
                            console.log('划屏操作')
                            return
                        }, 30000)
                    })
                }
                //翻倍操作
                if (id('gold_action_text').exists())
                    if (id('gold_action_text').findOne().text() == '点击翻倍' || id('gold_action_text').findOne().text() == '点击 x4 倍')
                        click_by_id('gold_action_layout')


                //关闭广告弹层
                click_by_text('O1CN0157Hhvw1cdq2jrQoth_!!6000000003624-2-tps-72-72')

                //判断还有没有元宝中心按钮
                if (!id('gold_progress_bar').exists())
                    break
            }
            if (null != thread_egg)
                thread_egg.interrupt()
            if (null != thread_swipe)
                thread_swipe.interrupt()
            if (null != thread_egg_id)
                clearTimeout(thread_egg_id)
            if (null != thread_swipe_id)
                clearTimeout(thread_swipe_id)
            click_by_id('gold_progress_bar')
            sleep(500)
            if (id('gold_egg_image').exists()) //防止点击到领取满蛋积分，而不能进入元宝中心的操作
                id('gold_egg_image').click()
            sleep(3000)
        }
    }

}

// 京东签到------------------------------------

function jd_signin() {
    app.launch('com.jingdong.app.mall')
    sleep(7000)

    //click_by_text('领京豆')  //第一次打开京东，会找不到这个text按钮，换用图片查找
    find_images(3, './img/领京豆按钮.jpg', undefined, true)
    sleep(2000)
    click_by_textcontains('签到领')

    toast_console('京东签到完成')
}

// 京东金融签到
function jdjr_signin() {
    app.launch('com.jd.jrapp')
    sleep(10000)

    //有弹窗广告

    click_by_text('签到')
    sleep(5000)

    click_by_text('签到领金贴')
    toast_console('京东金融签到完成')

}
// 多点签到
function duodian_signin() {
    app.launch('com.wm.dmall')
    sleep(10000)

    //关闭广告
    if (!click_by_desc('多点')) click_by_id('com.wm.dmall:id/iv_close')
    sleep(2000)
    click_by_text('及时达')
    sleep(2000)
    swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 5, 500)
    sleep(2000)
    find_images(3, './img/多点签到按钮.jpg')
    sleep(5000)
    click_by_text('bdbb222e-ecbe-4bb5-bd42-ce7b93013fd4')

    toast_console('多点签到完成')
}

ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="自动刷积分脚本" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <frame>
                    <scroll>
                        <vertical >
                            <checkbox text="支付宝会员积分" id="ck_points_task" checked='true' />
                            <checkbox text="支付宝芭芭农场" id="ck_farm_task" checked='true' />
                            <checkbox text="支付宝蚂蚁森林" id="ck_forest_task" checked='true' />
                            <button id="btn_run_main" text="执行选中任务" />
                            <button id="btn_save_opt" text="保存当前配置" />
                            <button id="btn_exit" text="退出" />
                        </vertical>
                    </scroll>
                </frame>
                <frame>
                    <scroll>
                        <vertical >
                            <checkbox text="多点签到" id="ck_duodian_signin" checked='true' />
                            <checkbox text="京东签到领京豆" id="ck_jd_signin" checked='true' />
                            <checkbox text="京东金融签到" id="ck_jdjr_signin" checked='true' />
                            <button id="btn_run_signin" text="执行选中的签到任务" />
                        </vertical>
                    </scroll>
                </frame>
                <frame>
                    <scroll>
                        <vertical >
                            <button id="btn_diantao_signin" text="点淘刷签到" />
                            <button id="btn_diantao_yuanbao" text="点淘刷元宝" />
                        </vertical>
                    </scroll>
                </frame>
            </viewpager>
        </vertical>
    </drawer>
);


activity.setSupportActionBar(ui.toolbar);

//设置滑动页面的标题
ui.viewpager.setTitles(["支付宝", "其他签到", "点淘"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);
ui.btn_exit.click(function () { ui.finish() })
ui.btn_save_opt.click(save_opt)

load_opt() //加载保存配置

//运行选择项
ui.btn_run_main.click(function () {
    if (thread && thread.isAlive()) {
        toast_console('当前程序正在执行其他任务,请结束后再运行', true); return
    }
    thread = threads.start(function () {
        console.log('支付宝任务')
        main(1); //exit()
        //thread.interrupt()
    })
})

ui.btn_diantao_signin.click(function () {
    if (thread && thread.isAlive()) {
        toast_console('当前程序正在执行其他任务,请结束后再运行', true); return
    }
    thread = threads.start(function () {
        console.log('点淘签到')
        main(2); //exit()
        //thread.interrupt()
    })
})

ui.btn_diantao_yuanbao.click(function () {
    if (thread && thread.isAlive()) {
        toast_console('当前程序正在执行其他任务,请结束后再运行', true); return
    }
    thread = threads.start(function () {
        console.log('点淘刷元宝')
        main(3); //exit()
        //thread.interrupt()
    })
})

ui.btn_run_signin.click(function () {
    if (thread && thread.isAlive()) {
        toast_console('当前程序正在执行其他任务,请结束后再运行', true); return
    }
    thread = threads.start(function () {
        console.log('签到')
        requestScreenCapture(false);
        //多点签到
        if (ui.ck_duodian_signin.checked) {
            duodian_signin()
        }
        sleep(2000)
        //京东签到
        if (ui.ck_jd_signin.checked) {
            jd_signin()
        }
        sleep(2000)
        //京东金融签到
        if (ui.ck_jdjr_signin.checked) {
            jdjr_signin()
        }
        sleep(2000)
        toast_console('###***全部签到执行完毕***###');
        //exit()
        //thread.interrupt()
    })
})


function main(app) {
    requestScreenCapture(false);
    //console.show();
    if (app == 1) taojinbi_task();
    if (app == 2) diantao_task();
    if (app == 3) diantao_yuanbao();
    toast_console('###***全部任务执行完毕***###');
}



function taojinbi_task() {
    if (ui.ck_points_task.checked) {
        alipay_points()
    }
    if (ui.ck_farm_task.checked) {
        baba_farm_task()
    }
    if (ui.ck_forest_task.checked)
        ant_forest_task()
}

//获取选择框列表
function get_check_box_list() {
    return [ui.ck_points_task, ui.ck_farm_task, ui.ck_duodian_signin, ui.ck_jd_signin, ui.ck_jdjr_signin];
}

//加载选择项状态
function load_opt() {
    let list_ck_v = storage.get("list_ck", null)
    if (list_ck_v) {
        let list_ck = get_check_box_list();
        for (let i = 0; i < list_ck_v.length; i++) {
            list_ck[i].checked = list_ck_v[i];
        }
    }
}

//保存选项
function save_opt() {
    let list_ck = get_check_box_list().map(x => x.checked)
    storage.put("list_ck", list_ck)
    toast_console('选项保存成功', true);
}
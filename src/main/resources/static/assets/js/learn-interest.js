layui.use(['config', 'element', 'laytpl'], function(){
    var $ = layui.jquery;
    var config = layui.config;
    var laytpl = layui.laytpl;
    var element = layui.element;
    $.ajaxSettings.async = true;

    //获取感兴趣领域及渲染
    var domainChart = echarts.init(document.getElementById('showInterestDomains'));
    domainChart.showLoading();
    var option0 = {
        backgroundColor: '#ffffff',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {d}%'
        }
    };
    $.get(config.base_server + 'interest/domain?access_token=' + config.getToken(), function (data) {
        console.log("领域" + data);
        if(!data || data.length === 0){
            domainChart.hideLoading();
            domainChart.showLoading({
                text: "暂无感兴趣的领域......",
                showSpinner: false
            });
        }else {
            var domains = new Array();
            for (i = 0; i < data.count; i++) {
                var domain = new Object();
                domain.name = data.data[i].domain;
                domain.value = data.data[i].score;
                domains.push(domain);
            }
            option0.series = [
                {
                    name: '感兴趣的领域',
                    type: 'pie',
                    radius: [30, 70],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    data: domains
                }
            ];
            //console.log(option0);
            domainChart.hideLoading();
            domainChart.setOption(option0);
        }
    });

    //获取感兴趣的话题及渲染
    var topicChart = echarts.init(document.getElementById("showInterestTopics"));
    topicChart.showLoading();
    var option1 = {
        backgroundColor: '#ffffff'
    };
    $.get(config.base_server + 'interest/topic?access_token=' + config.getToken(), function (data) {
        if(!data || data.length === 0){
            topicChart.hideLoading();
            topicChart.showLoading({
                text: "暂无感兴趣的话题......",
                showSpinner: false
            });
        }else {
            var topics = new Array();
            for (i = 0; i < data.count; i++) {
                var topic = new Object();
                topic.name = data.data[i].topicName;
                topic.value = data.data[i].count;
                topics.push(topic);
            }
            option1.series = [
                {
                    type: 'wordCloud',
                    shape: 'pentagon',
                    center: ['50%', '50%'],
                    textStyle: {
                        normal: {
                            color: function () {
                                return 'rgb(' + [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') + ')';
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333'
                        }
                    },
                    data: topics
                }
            ];
            //console.log(option1);
            topicChart.hideLoading();
            topicChart.setOption(option1);
        }
    });

    // 感兴趣的课程
    $.get(config.base_server + 'interest/course?access_token=' + config.getToken(), function(data){
        //console.log(data);
        var interestCourse = [{"courseName": "暂无感兴趣的课程"}];
        if(data && data.length > 0){
            interestCourse = data;
        }
        var getCourseTpl = document.getElementById("course").innerHTML;
        var courseView = document.getElementById("course-box");
        laytpl(getCourseTpl).render(interestCourse, function (html) {
            courseView.innerHTML = html;
            element.render();
        });
    });
});
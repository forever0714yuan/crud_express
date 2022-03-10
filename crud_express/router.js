var express = require('express');
var fs = require('fs');
var Student = require('./student');

//1.创建一个路由容器
var router = express.Router();

//2.把路由都挂载到 router 路由容器中
router.get('/students', function (req, res) {
    //
    // fs.readFile('./db.json', 'utf8', function (err, data) {
    //     if (err) {
    //         return res.status(500).send('Server error.')
    //     }
    //     var students = JSON.parse(data).students;
    //     res.render('index.html', {
    //         fruites: ['苹果', '香蕉', '橘子'],
    //         //从文件中读取到的数据一定是字符串
    //         //所以这里一定要手动转成对象
    //         students: students
    //     })
    // })

    Student.find(function (err, students) {
        if (err) {
            return res.status(500).send('Server error.')
        }
        res.render('index.html', {
            fruites: [
                {
                    name: '张文立',
                    hobby: '读书，喜爱研究，吃饭'
                },
                {
                    name:'张宇',
                    hobby:'打篮球，写代码，打游戏，爱高数'
                },
                {
                    name:'张云翔',
                    hobby:'学习，爱rap'
                }
            ],
            //从文件中读取到的数据一定是字符串
            //所以这里一定要手动转成对象
            students: students
        })
    })
});

router.get('/students/new', function (req, res) {
    res.render('new.html');
});

router.post('/students/new', function (req, res) {
    //1.获取表单数据
    var student = req.body;
    //2.处理
    new Student(student).save(student, function (err) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        //3.发送响应
        res.redirect('/students');
    })
});
/**
 * 渲染编辑学生页面
 */
router.get('/students/edit', function (req, res) {
    // console.log(parseInt(req.query.id));
    // console.log(req.query.id.replace(/"/g,''));
    Student.findById(req.query.id, function (err, student) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.render('edit.html', {
            student: student
        })
    })
});

router.post('/students/edit', function (req, res) {
    Student.findByIdAndUpdate(req.body.id, req.body, function (err) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.redirect('/students')
    })
});

router.get('/students/delete', function (req, res) {
    if (req.query.id === '') {
        return res.send('已经没有人可以删除了QVQ')
    }
    Student.findByIdAndDelete(req.query.id, function (err) {
        if (err) {
            return res.status(500).send('Server error.');
        }
        res.redirect('/students');
    })
});

//3.将router 导出
module.exports = router;



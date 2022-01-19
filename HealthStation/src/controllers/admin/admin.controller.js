const {
  createAdmin,
  setFirstGenerate,
} = require('../../models/admin/admin.model');



const userM = require('../../models/user/user.model');
const managerModel = require('../../models/manager/manager.model')
const { generatePassword } = require('../../lib/utils')

const fakeData = [
  {
    name: 'Sage Rodriguez',
    country: 'Netherlands',
    city: 'Baileux',
    salary: '$56,142',
  },
  {
    name: 'Doris Greene',
    country: 'Malawi',
    city: 'Feldkirchen in Kärnten',
    salary: '$63,542',
  },
  {
    name: 'Mason Porter',
    country: 'Chile',
    city: 'Gloucester',
    salary: '$78,615',
  },
  {
    name: 'Jon Porter',
    country: 'Portugal',
    city: 'Gloucester',
    salary: '$98,615',
  },
];

const fakeManagementData = [
  {
    type: 'Thêm mới',
    description: 'Thêm bệnh nhân A vào danh sách những người F0 ',
    create_at: '22/12/2021',
  },
  {
    type: 'Thêm nhu yếu phẩm',
    description: 'Thêm Đường vào danh sách nhu yếu phẩm',
    create_at: '22/12/2021',
  },
  {
    type: 'Xóa gói nhu yếu phẩm',
    description: 'Xóa gói hỗ trợ 69',
    create_at: '22/12/2021',
  },
  {
    type: 'Chuyển nơi điều trị',
    description: 'Chuyền bệnh nhân X từ khu cách ly A sang khu cách ly B',
    create_at: '22/12/2021',
  },
  {
    type: 'Xuất viện',
    description: 'Cho phép bệnh nhân A rời khỏi khu cách ly',
    create_at: '22/12/2021',
  },
];

const locationModel = require('../../models/sites/location.model')

module.exports = {
  
  get: async (req, res) => {
    const message = req.session.message || {}
    req.session.message = null
        res.render('layouts/admin/createManagerAcc',
            {
                layout: 'admin/main',
                message: message,
                active: { createAcc: true }
            }
        )
    },
    getAccount: async (req, res) => {
        res.render('layouts/admin/accountManagement',
            {
                layout: 'admin/main',
                data: fakeData,
                active: { accManagement: true }
            }
        )
    },
    createAccount: async (req, res) => {
      const { username, password, password_confirmation } = req.body

      // confirm password does not match
      if(password !== password_confirmation) {
        req.session.message = {
            content: 'Mật khẩu nhập lại không chính xác!',
            status: 'danger'
        } 
        return res.redirect('/admin')
      }

      const hashPassword = await generatePassword(password)
      const response = await managerModel.createManager(username, hashPassword)
      let message = {
        content: 'Tạo tài khoản thành công!',
        status: 'success'
      }
      if(!response || typeof response === 'string' || response instanceof String) {
        message = {
          content: 'Đã có lỗi hoặc tài khoản đã tồn tại!',
          status: 'danger'
      }
    } 

    req.session.message = message
    return res.redirect('/admin')
    
  },
    getAccountHistory: async (req, res) => {
        res.render('layouts/admin/accountHistory',
            {
                layout: 'admin/main',
                data: fakeManagementData,
                active: { accManagement: true }
            }
        )
    },
    getIsolationWard: async (req, res) => {
        const { data } = await locationModel.findAll()
        res.render('layouts/admin/isolationWardManagement',
            {
                layout: 'admin/main',
                data: data,
                active: { isolationWardManagement: true }
            }
        )
    },

    createIsolationWard: async (req, res) => {
        
        await locationModel.create(req.body)
        res.redirect('/admin/isolation-ward')
    },

    updateIsolationWard: async (req, res) => {
        await locationModel.update(req.body)
        res.redirect('/admin/isolation-ward')
    },

    deleteIsolationWard: async (req, res) => {
        const id = req.body.delete_location_id
        await locationModel.deleteById(id)
        res.redirect('/admin/isolation-ward')
    },

  firstCreate: async (req, res) => {
    res.render('layouts/admin/firstCreate', {
      layout: '',
    });
  },
  setUpAdmin: async (req, res) => {
    const username = req.body.Username;
    const password = req.body.Password;
    const create_admin = await createAdmin(password);
    if (create_admin == true) {
      const set_first_generate = await setFirstGenerate();
      if (set_first_generate != true) {
        const admin_user = await userM.findByUsername('admin');
        const user = await userM.deleteById(admin_user.data.id);
        return res.render('layouts/admin/firstCreate', {
          layout: '',
          error: { status: true, msg: 'Failed to generate' },
        });
      }
      return res.redirect('/');
    } else {
      return res.render('layouts/admin/firstCreate', {
        layout: '',
        error: { status: true, msg: 'Failed to generate' },
      });
    }
  },
};
 

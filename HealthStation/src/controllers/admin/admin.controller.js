const {
  createAdmin,
  setFirstGenerate,
} = require('../../models/admin/admin.model');
const userM = require('../../models/user/user.model');

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

const fakeIsolationWardData = [
  {
    name: 'Sage Rodriguez',
    capacity: 5,
    used: 5,
  },
  {
    name: 'Doris Greene',
    capacity: 5,
    used: 5,
  },
  {
    name: 'Jon Porter',
    capacity: 5,
    used: 5,
  },
  {
    name: 'Mason Porter',
    capacity: 5,
    used: 5,
  },
  {
    name: 'Chet Faker',
    capacity: 5,
    used: 5,
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

module.exports = {
  get: async (req, res) => {
    res.render('layouts/admin/createManagerAcc', {
      layout: 'admin/main',
      active: { createAcc: true },
    });
  },
  getAccount: async (req, res) => {
    res.render('layouts/admin/accountManagement', {
      layout: 'admin/main',
      data: fakeData,
      active: { accManagement: true },
    });
  },
  getAccountHistory: async (req, res) => {
    res.render('layouts/admin/accountHistory', {
      layout: 'admin/main',
      data: fakeManagementData,
      active: { accManagement: true },
    });
  },
  getIsolationWard: async (req, res) => {
    res.render('layouts/admin/isolationWardManagement', {
      layout: 'admin/main',
      data: fakeIsolationWardData,
      active: { isolationWardManagement: true },
    });
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

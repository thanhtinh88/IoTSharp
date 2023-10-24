import { accountApi } from '/@/api/user';
import _ from 'lodash-es';
import { TableDataRow } from '../model/userListModel';
import { ElMessage } from 'element-plus';
import { compute } from '@fast-crud/fast-crud';
export const createUserListCrudOptions = function ({ expose }, customerId) {
    let records: any[] = [];
    const FsButton = {
        link: true,
    };
    const customSwitchComponent = {
        activeColor: 'var(--el-color-primary)',
        inactiveColor: 'var(el-switch-of-color)',
    };
    const requiredCustomSwitchComponent = {
        required: 'required',
        activeColor: 'var(--el-color-primary)',
        inactiveColor: 'var(el-switch-of-color)',
    };
    const pageRequest = async (query) => {
        let {
            form: { userName: name },
            page: { currentPage: currentPage, pageSize: limit },
        } = query;
        let offset = currentPage === 1 ? 0 : currentPage - 1;
        const res = await accountApi().accountList({ name, limit, offset, customerId });
        return {
            records: res.data.rows,
            currentPage: currentPage,
            pageSize: limit,
            total: res.data.total,
        };
    };
    const editRequest = async ({ form, row }) => {
        form.id = row.id;
        try {
            await accountApi().putAccount(form);
            return form;
        } catch (e) {
            ElMessage.error(e.response.msg);
        }
    };
    const delRequest = async ({ row }) => {
        try {
            await accountApi().deleteAccount(row.id);
            _.remove(records, (item: TableDataRow) => {
                return item.id === row.id;
            });
        } catch (e) {
            ElMessage.error(e.response.msg);
        }
    };
    const addRequest = async ({ form }) => {
        try {
            //验证
            var userName = form.userName;
            var email = form.email;
            if (userName) {
                if (email) {
                    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                    if (regEmail.test(email)) {
                        await accountApi().postAccount({
                            ...form,
                            customerId,
                        });
                        records.push(form);
                        return form;
                    } else {
                        ElMessage.error('Please enter a legal email address');
                    }
                } else {
                    ElMessage.error('Please fill in your email');
                }
            } else {
                ElMessage.error('Please fill in the user name');
            }
        } catch (e) {
            ElMessage.error(e.response.msg);
        }
    };
    return {
        crudOptions: {
            request: {
                pageRequest,
                addRequest,
                delRequest,
                editRequest,
            },
            table: {
                border: false,
            },
            actionbar: {
                buttons: {
                    add: {

                    },
                },
            },
            form: {
                labelWidth: '80px', //
                beforeSubmit: function (subParam) {
                    var form = subParam.form;
                    if (subParam.mode == 'add') {
          //Verify username
                        var userName = form.userName;
                        var email = form.email;
                        if (userName) {
                            if (email) {
                                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                                if (regEmail.test(email)) {
                                    //Need to verify whether it is duplicated

                                } else {
                                    ElMessage.error('Please enter a legal email address');
                                    throw new Error('Please enter a valid email address');
                                }
                            } else {
                                ElMessage.error('Please fill in your email');
                                throw new Error('Please fill in your email address');
                            }
                        } else {
                            ElMessage.error('Please fill in the user name');
                            throw new Error('Please fill in the user name');
                        }
                    }
                }
            },
            search: {
                show: true,
            },
            rowHandle: {
                width: 180,
                buttons: {
                    view: {
                        icon: 'View',
                        ...FsButton,
                        show: false,
                    },
                    edit: {
                        icon: 'EditPen',
                        ...FsButton,
                        order: 1,
                    },
                    remove: {
                        icon: 'Delete',
                        ...FsButton,
                        order: 2,
                    }, // delete button
                },
            },
            columns: {
                tenantName: {
                    title: 'Owning tenant',
                    type: 'text',
                    column: { width: 140 },
                    addForm: {
                        show: false,
                    },
                    editForm: {
                        show: false,
                    },
                },
                customerName: {
                    title: 'Customer',
                    type: 'text',
                    column: { width: 140 },
                    addForm: {
                        show: false,
                    },
                    editForm: {
                        show: false,
                    },
                },
                //id: {
                //	title: 'Id',
                //	type: 'text',
                //	column: { width: 300 },
                //	addForm: {
                //		show: false,
                //	},
                //	editForm: {
                //		show: false,
                //	},
                //},
                userName: {
                    title: 'user name',
                    type: 'text',
                    column: { width: 200 },
                    search: { show: true }, //显示查询
                    addForm: {
                        show: true,
                        component: requiredCustomSwitchComponent,
                    },
                    editForm: {
                        show: true,
                        component: requiredCustomSwitchComponent,
                    },
                },
                email: {
                    title: 'email',
                    column: { width: 200 },
                    type: 'text',
                    addForm: {
                        show: true,
                        component: requiredCustomSwitchComponent,
                    },
                    editForm: {
                        show: true,
                        component: requiredCustomSwitchComponent,
                    },
                },
                phoneNumber: {
                    title: 'phone',
                    column: { width: 140 },
                    type: 'text',
                    addForm: {
                        show: true,
                        component: customSwitchComponent,
                    },
                    editForm: {
                        show: true,
                        component: customSwitchComponent,
                    },
                },
                accessFailedCount: {
                    title: 'Number of login failures',
                    column: { width: 135 },
                    type: 'text',
                    addForm: {
                        show: false,
                    },
                    editForm: {
                        show: false,
                    },
                },
                lockoutEnabled: {
                    title: 'Lock',
                    addForm: {
                        show: false,
                    },
                    column: {
                        width: 100,
                        component: {
                            name: 'fs-dict-switch',
                            show: true,
                            onChange: compute((context) => {
                                return async () => {
                                    const { id: Id, lockoutEnabled } = context.row;
                                    await accountApi().updateAccountStatus({
                                        Id,
                                        opt: lockoutEnabled ? 'Lock' : 'Unlock',
                                    });
                                };
                            }),
                        },
                    },
                    editForm: {
                        show: false,
                    },
                },
                lockoutEnd: {
                    addForm: {
                        show: false,
                    },
                    title: 'Lock deadline',
                    //column: { width: 150 },
                    type: 'text',
                    editForm: {
                        show: false,
                    },
                },
            },
        },
    };
};

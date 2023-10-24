// Left menu navigation data
export const leftNavList = [
    {
        title: 'executor',
        icon: 'iconfont icon-shouye',
        isOpen: true,
        id: '1',
        children: [
            {
                icon: 'iconfont icon-gongju',
                name: 'Engine',
                id: '11',
                form: [
                    {
                        type: 'input',
                        label: 'Customer Name',
                        prop: 'name',
                        placeholder: 'Please enter customer name',
                        required: true,
                        disabled: false,
                    },
                    {
                        type: 'select',
                        label: 'gender',
                        prop: 'sex',
                        placeholder: 'Please select gender',
                        required: true,
                        disabled: false,
                        options: [
                            {
                                value: '0',
                                label: 'female',
                            },
                            {
                                value: '1',
                                label: 'male',
                            },
                        ],
                    },
                    {
                        type: 'input',
                        label: 'employee number',
                        prop: 'number',
                        placeholder: 'Please enter employee number',
                        required: true,
                        disabled: false,
                    },
                    {
                        type: 'input',
                        label: 'office phone',
                        prop: 'mobile',
                        placeholder: 'Please enter your office phone number',
                        required: true,
                        disabled: false,
                    },
                    {
                        type: 'select',
                        label: 'Permission assignment',
                        prop: 'role',
                        placeholder: 'Please select gender',
                        required: true,
                        disabled: false,
                        options: [
                            {
                                value: '0',
                                label: 'edit permission',
                            },
                            {
                                value: '1',
                                label: 'Delete permission',
                            },
                        ],
                    },
                    {
                        type: 'checkbox',
                        label: 'Module selection',
                        prop: 'module',
                        placeholder: 'Please select a module',
                        required: true,
                        disabled: false,
                    },
                ],
            },
            {
                icon: 'iconfont icon-shouye_dongtaihui',
                name: 'template',
                id: '12',
                form: [
                    {
                        type: 'input',
                        label: 'Level',
                        prop: 'grade',
                        placeholder: 'Please enter the level',
                        required: true,
                        disabled: false,
                    },
                    {
                        type: 'input',
                        label: 'Registration password',
                        prop: 'password',
                        placeholder: 'Please enter the registration password',
                        required: true,
                        disabled: false,
                    },
                ],
            },
            {
                icon: 'iconfont icon-zhongduancanshuchaxun',
                name: 'name',
                id: '13',
                form: [
                    {
                        type: 'input',
                        label: 'data table',
                        prop: 'dataSheet',
                        placeholder: 'Please enter the data table',
                        required: true,
                        disabled: false,
                    },
                    {
                        type: 'input',
                        label: 'field configuration',
                        prop: 'field',
                        placeholder: 'Please enter field configuration',
                        required: true,
                        disabled: false,
                    },
                ],
            },
            {
                icon: 'iconfont icon-zhongduancanshu',
                name: 'version',
                id: '14',
                form: [
                    {
                        type: 'input',
                        label: 'Publish template',
                        prop: 'publish',
                        placeholder: 'Please enter publishing template',
                        required: true,
                        disabled: false,
                    },
                ],
            },
            {
                icon: 'iconfont icon-bolangnengshiyanchang',
                name: 'Modeling',
                id: '15',
                form: [
                    {
                        type: 'input',
                        label: 'content template',
                        prop: 'content',
                        placeholder: 'Please enter content template',
                        required: true,
                        disabled: false,
                    },
                ],
            },
            {
                icon: 'iconfont icon-xingqiu',
                name: 'node',
                id: '16',
                form: [
                    {
                        type: 'input',
                        label: 'Activity name 6',
                        prop: 'name16',
                    },
                ],
            },
        ],
    },
    {
        title: 'Task',
        isOpen: true,
        icon: 'iconfont icon-caijian',
        id: '2',
        children: [
            {
                icon: 'iconfont icon-fuwenben',
                name: 'instance',
                id: '21',
                form: [
                    {
                        type: 'input',
                        label: 'Activity name 7',
                        prop: 'name21',
                    },
                ],
            },
            {
                icon: 'iconfont icon-fuwenbenkuang',
                name: 'track',
                id: '22',
                form: [
                    {
                        type: 'input',
                        label: 'Activity name 8',
                        prop: 'name22',
                    },
                ],
            },
            {
                icon: 'iconfont icon-shangchuan',
                name: 'data',
                id: '23',
                form: [
                    {
                        type: 'input',
                        label: 'Activity name 9',
                        prop: 'name23',
                    },
                ],
            },
        ],
    },

];
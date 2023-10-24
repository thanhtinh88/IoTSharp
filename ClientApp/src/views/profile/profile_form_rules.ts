export const rule = [
    {
        type: 'input',
        field: 'email',
        title: 'E mail',
        info: '',
        props: {
            type: 'text',
            placeholder: 'please input your email',
            showPassword: false,
            prefixIcon: 'Message',
        },
        _fc_drag_tag: 'input',
        hidden: false,
        display: true,
        validate: [
            {
                trigger: 'change',
                message: 'please enter your vaild email',
                pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                type: 'email',
                required: true,
            },
        ],
    },
    {
        type: 'input',
        field: 'name',
        title: 'User name',
        info: '',
        props: {
            type: 'text',
            placeholder: 'please enter user name',
            prefixIcon: 'User',
        },
        _fc_drag_tag: 'input',
        hidden: false,
        display: true,
        $required: 'please enter user name',
    },
    {
        type: 'input',
        field: 'phoneNumber',
        title: 'contact number',
        info: '',
        props: {
            placeholder: 'contact number',
            showPassword: false,
            type: 'text',
            prefixIcon: 'Cellphone'
        },
        _fc_drag_tag: 'input',
        hidden: false,
        display: true,
        value: '',
        validate: [
            {
                trigger: 'change',
                message: 'please enter a valid phone number',
                pattern: /^(1[3456789]\d{9})$/,
            },
        ],
    },
]

export const passwordFormRules = [
    {
        type: 'input',
        field: 'pass',
        title: 'Original password',
        info: '',
        props: {
            type: 'password',
            placeholder: 'Please enter the original password',
            showPassword: true
        },
        _fc_drag_tag: 'input',
        hidden: false,
        display: true,
        validate: [
            {
                trigger: 'change',
                message: 'Please enter the original password',
                required: true,
            },
        ],
    },
    {
        type: 'input',
        field: 'passnew',
        title: 'New Password',
        info: '',
        props: {
            type: 'password',
            placeholder: 'Please enter a new password',
            showPassword: true
        },
        _fc_drag_tag: 'input',
        hidden: false,
        display: true,
        validate: [
            {
                trigger: 'change',
                message: 'Please enter new password',
                required: true,
            },
        ],
    },
    {
        type: 'input',
        field: 'passnewsecond',
        title: 'Please enter a new password',
        info: '',
        props: {
            placeholder: 'Please re-enter the new password',
            showPassword: true,
            type: 'password',
        },
        _fc_drag_tag: 'input',
        hidden: false,
        display: true,
        value: '',
        validate: [],
    },
]
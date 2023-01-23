const MadeCells = [
    U0_R0_D0_L0 = {
        up: SideType.NO_LINE,
        right: SideType.NO_LINE,
        down: SideType.NO_LINE,
        left: SideType.NO_LINE,
    },
    U0_R1_D1_L1 = {
        up: SideType.NO_LINE,
        right: SideType.ONE_LINE,
        down: SideType.ONE_LINE,
        left: SideType.ONE_LINE,
    },
    U1_R0_D1_L1 = {
        up: SideType.ONE_LINE,
        right: SideType.NO_LINE,
        down: SideType.ONE_LINE,
        left: SideType.ONE_LINE,
    },
    U1_R1_D0_L0 = {
        up: SideType.ONE_LINE,
        right: SideType.ONE_LINE,
        down: SideType.NO_LINE,
        left: SideType.NO_LINE,
    },
    U1_R1_D0_L1 = {
        up: SideType.ONE_LINE,
        right: SideType.ONE_LINE,
        down: SideType.NO_LINE,
        left: SideType.ONE_LINE,
    },
    U1_R1_D1_L0 = {
        up: SideType.ONE_LINE,
        right: SideType.ONE_LINE,
        down: SideType.ONE_LINE,
        left: SideType.NO_LINE,
    },
    U1_R1_D1_L1 = {
        up: SideType.ONE_LINE,
        right: SideType.ONE_LINE,
        down: SideType.ONE_LINE,
        left: SideType.ONE_LINE,
    },
]
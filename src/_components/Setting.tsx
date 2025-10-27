import cx from "clsx";
import { Music, Music2, Settings } from "lucide-react";
import { DIFFICULTY } from "../game/config";
import { Activity, useEffect, useState } from "react";
import { EventBus } from "../game/EventBus";

const Difficulty = () => {
    const [difficulty, setDifficulty] = useState<string>();

    const onChangeDifficulty = (key: string) => {
        setDifficulty(key);
        localStorage.setItem("difficulty", key);
    };

    useEffect(() => {
        const difficulty = localStorage.getItem("difficulty");

        setDifficulty(difficulty ?? "normal");
    }, []);

    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-cols-12">
                <label className="col-span-3 flex items-center">
                    Difficulty:
                </label>
                <ul className="col-span-9 flex flex-wrap gap-2 items-center">
                    {Object.entries(DIFFICULTY).map(([key, value]) => {
                        const { label } = value;

                        const isActive = key === difficulty;

                        return (
                            <li key={key}>
                                <button
                                    className={cx(
                                        { "bg-blue-400 text-white": isActive },
                                        "px-2 py-1 hover:cursor-pointer rounded-md",
                                    )}
                                    onClick={() => onChangeDifficulty(key)}
                                >
                                    {label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {difficulty && (
                <div className="grid grid-cols-12">
                    <label className="col-span-3 flex items-start">
                        Description:
                    </label>
                    <ul className="col-span-9 flex flex-wrap gap-1 items-center ">
                        <li className="px-2 py-1 rounded-md">
                            WPM={DIFFICULTY?.[difficulty]?.wpm}
                        </li>
                        <li className="px-2 py-1 rounded-md">
                            Bonus=x{DIFFICULTY?.[difficulty]?.scoreBonus}
                        </li>
                        <li className="px-2 py-1 rounded-md">
                            Max Len={DIFFICULTY?.[difficulty]?.maxWordLen}
                        </li>
                        <li className="px-2 py-1 rounded-md">
                            Life Up Score=
                            {DIFFICULTY?.[
                                difficulty
                            ]?.lifeUpScore.toLocaleString()}
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const Sound = () => {
    return (
        <div className="grid grid-cols-12">
            <label className="col-span-3 flex items-center">Sound:</label>
            <ul className="col-span-9 flex flex-wrap gap-2 items-center">
                <li>
                    <button
                        className={cx(
                            { "bg-blue-400 text-white": true },
                            "flex gap-1 items-center px-2 py-1 hover:cursor-pointer rounded-md",
                        )}
                    >
                        <Music size={16} />
                        Music
                    </button>
                </li>
                <li>
                    <button
                        className={cx(
                            { "bg-blue-400 text-white": true },
                            "flex gap-1 items-center px-2 py-1 hover:cursor-pointer rounded-md",
                        )}
                    >
                        <Music2 size={14} />
                        SFX
                    </button>
                </li>
            </ul>
        </div>
    );
};

const Setting = () => {
    const [isShow, setShow] = useState(true);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const key = scene_instance?.key;

            setShow(key !== "Game");
        });
        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, []);

    if (!isShow) return <></>;

    return (
        <div className="fixed right-2 bottom-2 text-black">
            <button
                className="hover:cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <Settings fill="white" size={32} />
            </button>

            <Activity mode={isOpen ? "visible" : "hidden"}>
                <div className="absolute w-[450px] translate-[-100%] top-[-4px] left-[100%] bg-amber-50 rounded-md p-4 py-3">
                    <Difficulty />
                    {/* <Sound /> */}
                </div>
            </Activity>
        </div>
    );
};

export default Setting;
